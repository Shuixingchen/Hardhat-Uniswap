// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./interface/IGame.sol";

contract Game is IGame,Ownable{
    uint16 playA;
    uint16 playB;
    uint32 startTime;
    uint16 win;
    using SafeMath for uint256;
    uint fee = 90;
    uint256 minAmount = 10**16;
    bool hasSendPrize;
    
    // all depositer, teamid=>Order[]
    mapping(uint16=>Order[]) public depositers;
    // winners with award
    Order[] public winers;
    // teamid=>all deposit balance
    mapping(uint16=>uint256) public balance;

    constructor(uint16 _a, uint16 _b, uint32 _startTime) {
        console.log("a = %d; b = %d", _a, _b);
        require(_a>0 && _a<=32,"team id invalid");
        require(_b>0 && _b<=32,"team id invalid");
        playA = _a;
        playB = _b;
        startTime = _startTime;
    }

    // playA+playB is dogfall
    function deposit(address _depositer, uint16 _win) public payable onlyOwner  returns(bool){
        require(block.timestamp < startTime, "Bet Time expired");
        require(msg.value>minAmount, "deposit value must be greater than 0.01");
        require(_depositer != address(0), "deposit address invalid");
        require(_win == playA || _win == playB || _win == playA+playB, "invalid team");

        depositers[_win].push(Order({owner: _depositer, amount: msg.value}));
        balance[_win] += msg.value;

        emit Deposit(_depositer, msg.value,_win);
        return true;
    }

    // calculate win amount
    function _calculate(uint16 _win) internal {
        uint256 totalAll = (balance[playA] + balance[playB] + balance[playA+playB])*fee/100;
        uint256 total = balance[_win];
        if (total > 0) {
            for (uint i=0; i<depositers[_win].length; i++) {
                Order memory order = depositers[_win][i];
                uint256 winAmount = _mulDiv(order.amount, totalAll, total);
                winers.push(Order({owner: order.owner, amount: winAmount}));
            }
        }
    }

    // from ChainLink
    function setWiner(uint16 _win) public onlyOwner returns(bool){
        require(block.timestamp > startTime, "time invalid");
        require(_win == playA || _win == playB || _win == playA+playB , "win invalid");
        require(hasSendPrize, "can't change result after send prize");
        win = _win;
        _calculate(_win);
        emit SetWiner(_win);
        return true;
    }

    function getWiners() view public returns(Order[] memory) {
        return winers;
    }

    // send eth to winner
    function sendPrize() public onlyOwner returns(bool){
        require(hasSendPrize == false, "has SendPrize");
        hasSendPrize = true;
        for (uint i=0; i<winers.length; i++) {
            _send(payable(winers[i].owner), winers[i].amount);
            emit SendPrize(winers[i].owner, winers[i].amount);
        }
        return true;
    }

    function _mulDiv (uint x, uint y, uint z) private pure returns (uint)
    {
        return SafeMath.mul(x, y) / z;
    }

    function _send(address payable to, uint256 amount) private {
        require(to.send(amount), "Transfer ETH failed");
    }
}