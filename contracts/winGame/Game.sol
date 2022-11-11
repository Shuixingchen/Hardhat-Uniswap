// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Game is Ownable{
    uint16 playA;
    uint16 playB;
    uint32 startTime;
    uint16 win;
    using SafeMath for uint256;
    uint fee = 90;
    bool isWithdraw;

    struct Order {
        address owner;
        uint256 amount;
    }
    // all depositer, playid=>Order[]
    mapping(uint16=>Order[]) public depositers;
    // winners with award
    Order[] public winers;
    // playid=>all deposit balance
    mapping(uint16=>uint256) public balance;

    event Deposit(address indexed depositer, uint256 amount, uint16 win);
    event SetWiner(uint16 win);
    event Withdraw(address indexed receiver, uint256 amount);

    constructor(uint16 _a, uint16 _b, uint32 _startTime) {
        console.log("a = %d; b = %d", _a, _b);
        require(_a>0 && _a<=32,"play id invalid");
        require(_b>0 && _b<=32,"play id invalid");
        playA = _a;
        playB = _b;
        startTime = _startTime;
    }

    // playA+playB is dogfall
    function deposit(address _depositer, uint16 _win) public onlyOwner payable{
        require(block.timestamp < startTime, "Bet Time expired");
        require(msg.value>0, "deposit value invalid");
        require(_depositer != address(0), "deposit address invalid");
        require(_win == playA || _win == playB || _win == playA+playB, "invalid team");

        depositers[_win].push(Order({owner: _depositer, amount: msg.value}));
        balance[_win] += msg.value;

        emit Deposit(_depositer,msg.value,_win);
    }

    function _calculate(uint16 _win) private {
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
    function setWiner(uint16 _win) public onlyOwner{
        require(block.timestamp > startTime, "time invalid");
        require(_win == playA || _win == playB || _win == playA+playB , "win invalid");
        win = _win;
        _calculate(_win);
        emit SetWiner(_win);
    }

    // send eth to winner
    function withdraw() public onlyOwner {
        require(isWithdraw == false, "has withdrawed");
        isWithdraw = true;
        for (uint i=0; i<winers.length; i++) {
            _send(payable(winers[i].owner), winers[i].amount);
            emit Withdraw(winers[i].owner, winers[i].amount);
        }
    }

    function _mulDiv (uint x, uint y, uint z) private pure returns (uint)
    {
        return SafeMath.mul(x, y) / z;
    }

    function _send(address payable to, uint256 amount) private {
        require(to.send(amount), "Transfer ETH failed");
    }
}