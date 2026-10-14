// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./HookTreasuryVault.sol";
import "./HookPolicyEngine.sol";

/// @title HookAgentRegistry — permissionless agent registration + vault factory
contract HookAgentRegistry is Ownable {
    struct Agent {
        address vault;
        address token;
        address owner;
        string name;
        string tokenSymbol;
        string strategy;
        uint256 createdAt;
    }

    HookPolicyEngine public engine;
    Agent[] public agents;
    mapping(address => uint256[]) public byOwner;

    event AgentRegistered(uint256 indexed id, address indexed vault, address indexed owner, string name);

    constructor(address _owner, address _engine) Ownable(_owner) {
        engine = HookPolicyEngine(_engine);
    }

    function register(
        address token,
        string calldata name,
        string calldata symbol,
        string calldata strategy,
        uint256 maxTx,
        uint256 dayCap,
        uint256 interval
    ) external returns (address vault) {
        HookTreasuryVault v = new HookTreasuryVault(msg.sender, address(this), address(engine), maxTx, dayCap, interval);
        vault = address(v);
        agents.push(Agent(vault, token, msg.sender, name, symbol, strategy, block.timestamp));
        byOwner[msg.sender].push(agents.length - 1);
        engine.setPolicy(vault, maxTx, dayCap, interval, 200);
        emit AgentRegistered(agents.length - 1, vault, msg.sender, name);
    }

    function count() external view returns (uint256) {
        return agents.length;
    }
}
