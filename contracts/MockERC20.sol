// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @notice Test-only mock token for BSC testnet drills.
contract MockERC20 is ERC20 {
    constructor() ERC20("HookMock", "HMOCK") {
        _mint(msg.sender, 1_000_000 ether);
    }
    function faucet(address to, uint256 amt) external {
        _mint(to, amt);
    }
}
