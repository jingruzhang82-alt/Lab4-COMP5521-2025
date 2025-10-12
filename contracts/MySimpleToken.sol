// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import OpenZeppelin's ERC20 and Ownable contracts
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MySimpleToken
 * @dev A very simple ERC20 token for educational purposes.
 * - It inherits from OpenZeppelin's ERC20 implementation.
 * - It uses Ownable to ensure that only the contract deployer (owner) can mint new tokens.
 */
contract MySimpleToken is ERC20, Ownable {

    // Constructor, executed once during deployment
    constructor() ERC20("My Simple Token", "MST") Ownable(msg.sender) {}

    /**
     * @dev Create new tokens and allocate them to an account.
     * Only the owner can call this function.
     * @param to The address that will receive the new tokens.
     * @param amount The amount of tokens to mint.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}