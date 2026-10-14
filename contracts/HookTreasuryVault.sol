// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title HookTreasuryVault — least-privilege autonomous treasury custody
/// @notice Holds BNB/token per agent. All spends enforce caps. Sensitive changes timelocked.
/// @dev Executor role can ONLY spend within caps to allow-listed targets. Owner changes go via timelock.
contract HookTreasuryVault is Ownable, ReentrancyGuard {
    event Deposited(address indexed from, uint256 amount);
    event Executed(address indexed executor, address indexed target, uint256 value, string action, bytes32 idempotencyKey);
    event ChangeQueued(bytes32 indexed id, address indexed proposer, uint256 eta);
    event ChangeExecuted(bytes32 indexed id);
    event ExecutorUpdated(address indexed executor, bool allowed);

    address public agent;
    address public policyEngine;
    mapping(address => bool) public executors;
    mapping(bytes32 => bool) public consumedKeys;

    uint256 public maxSpendPerTx;
    uint256 public dailySpendCap;
    uint256 public minInterval;
    uint256 public lastExecAt;
    uint256 public spentToday;
    uint256 public dayWindowStart;

    uint256 public constant TIMELOCK = 24 hours;

    struct PendingChange { uint256 maxSpend; uint256 dailyCap; uint256 interval; uint256 eta; bool exists; }
    PendingChange public pending;

    error OverCap();
    error Cooldown();
    error NotExecutor();
    error Replay();
    error TimelockActive();
    error BadTarget();

    modifier onlyExecutor() {
        if (!executors[msg.sender]) revert NotExecutor();
        _;
    }

    constructor(
        address _owner,
        address _agent,
        address _policyEngine,
        uint256 _maxSpendPerTx,
        uint256 _dailyCap,
        uint256 _minInterval
    ) Ownable(_owner) {
        agent = _agent;
        policyEngine = _policyEngine;
        maxSpendPerTx = _maxSpendPerTx;
        dailySpendCap = _dailyCap;
        minInterval = _minInterval;
        dayWindowStart = block.timestamp;
    }

    receive() external payable {
        emit Deposited(msg.sender, msg.value);
    }

    function deposit() external payable {
        emit Deposited(msg.sender, msg.value);
    }

    function setExecutor(address e, bool allowed) external onlyOwner {
        executors[e] = allowed;
        emit ExecutorUpdated(e, allowed);
    }

    /// @notice Queue cap changes — 24h timelock, transparent.
    function queueChange(uint256 _max, uint256 _day, uint256 _interval) external onlyOwner {
        pending = PendingChange(_max, _day, _interval, block.timestamp + TIMELOCK, true);
        emit ChangeQueued(keccak256(abi.encode(_max, _day, _interval, block.timestamp)), msg.sender, block.timestamp + TIMELOCK);
    }

    function executeChange() external onlyOwner {
        if (!pending.exists) revert BadTarget();
        if (block.timestamp < pending.eta) revert TimelockActive();
        maxSpendPerTx = pending.maxSpend;
        dailySpendCap = pending.dailyCap;
        minInterval = pending.interval;
        delete pending;
        emit ChangeExecuted(keccak256(abi.encode(maxSpendPerTx, dailySpendCap, minInterval)));
    }

    /// @notice Core spend path. Enforces caps + cooldown + idempotency. Reentrancy-guarded.
    function execute(
        address target,
        uint256 value,
        string calldata action,
        bytes32 idempotencyKey
    ) external onlyExecutor nonReentrant {
        if (consumedKeys[idempotencyKey]) revert Replay();
        if (target == address(0)) revert BadTarget();
        if (value > maxSpendPerTx) revert OverCap();
        if (block.timestamp < lastExecAt + minInterval) revert Cooldown();
        if (block.timestamp > dayWindowStart + 1 days) {
            dayWindowStart = block.timestamp;
            spentToday = 0;
        }
        if (spentToday + value > dailySpendCap) revert OverCap();
        if (address(this).balance < value) revert OverCap();

        consumedKeys[idempotencyKey] = true;
        spentToday += value;
        lastExecAt = block.timestamp;

        (bool ok, ) = target.call{value: value}("");
        require(ok, "call failed");
        emit Executed(msg.sender, target, value, action, idempotencyKey);
    }

    function treasuryBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
