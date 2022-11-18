// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;


struct Order {
    address owner;
    uint256 amount;
}
interface IGame {
    event Deposit(address indexed _depositer, uint256 _amount, uint16 _win);
    event SetWiner(uint16 _win);
    event SendPrize(address indexed _receiver, uint256 _amount);

    function deposit(address depositer, uint16 win) external payable returns(bool);
    function setWiner(uint16 win) external returns(bool);
    function sendPrize() external returns(bool);
    function withdraw(address payable receiver) external;
}