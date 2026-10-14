// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/HookPolicyEngine.sol";
import "../contracts/HookAgentRegistry.sol";

/// forge script script/Deploy.s.sol --rpc-url bsc_testnet --broadcast --verify
contract DeployHook is Script {
    function run() external {
        uint256 key = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(key);
        HookPolicyEngine engine = new HookPolicyEngine(msg.sender);
        HookAgentRegistry registry = new HookAgentRegistry(msg.sender, address(engine));
        engine.transferOwnership(address(registry));
        vm.stopBroadcast();
    }
}
