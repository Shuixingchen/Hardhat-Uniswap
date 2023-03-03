// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Reentry is ReentrancyGuard {
    mapping(address=>uint256) balances;

    function withdraw(uint256 _amount, address to) nonReentrant public{
        require(balances[msg.sender] >= _amount, " balance is short ");
        (bool success, ) = to.call{value: _amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
        balances[msg.sender] -= _amount;
    }
}