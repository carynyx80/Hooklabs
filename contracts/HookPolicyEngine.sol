// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title HookPolicyEngine — deterministic on-chain proposal validation
/// @notice Mirrors lib/policy.ts. AI proposes; this contract (and the TS mirror) decides.
contract HookPolicyEngine is Ownable {
    struct Policy {
        uint256 maxSpendPerTx;
        uint256 dailyCap;
        uint256 minInterval;
        uint256 maxSlippageBps;
    }

    mapping(address => Policy) public policies;
    mapping(address => bool) public allowListed;

    event PolicySet(address indexed vault, uint256 maxTx, uint256 day, uint256 interval, uint256 slip);

    constructor(address _owner) Ownable(_owner) {}

    function setPolicy(
        address vault,
        uint256 maxTx,
        uint256 day,
        uint256 interval,
        uint256 slip
    ) external onlyOwner {
        policies[vault] = Policy(maxTx, day, interval, slip);
        emit PolicySet(vault, maxTx, day, interval, slip);
    }

    function setAllowList(address target, bool allowed) external onlyOwner {
        allowListed[target] = allowed;
    }

    function validate(
        address vault,
        uint256 amount,
        uint256 spent24h,
        uint256 lastExecAt,
        uint256 slippageBps,
        address target
    ) external view returns (bool ok, string memory reason) {
        Policy memory p = policies[vault];
        if (p.maxSpendPerTx == 0) return (false, "no policy");
        if (amount > p.maxSpendPerTx) return (false, "exceeds per-tx cap");
        if (spent24h + amount > p.dailyCap) return (false, "exceeds daily cap");
        if (lastExecAt != 0 && block.timestamp < lastExecAt + p.minInterval) return (false, "cooldown");
        if (slippageBps > p.maxSlippageBps) return (false, "slippage too high");
        // allow-list enforced only when target registry is non-trivial; zero = native buyback router path
        if (target != address(0) && !allowListed[target]) return (false, "target not allowed");
        return (true, "approved");
    }
}
