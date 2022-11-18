// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/IGame.sol";
import "./Game.sol";

contract GameFactory  is Ownable {
    // all GameItems
    GameItem[] allGames;

    // play0=>paly1=>startTime=>GameAddr
    mapping(uint16=>mapping(uint16=>mapping(uint32=>address))) getGame;

    struct GameItem {
        uint16 play0;
        uint16 play1;
        uint32 startTime;
        address addr;
    }

    function createGame(uint16 playA, uint16 playB,  uint32 startTime)  external onlyOwner returns (address game){
        require(playA != playB, 'GameFactory: IDENTICAL_PLAY');
        (uint16 play0, uint16 play1) = playA < playB ? (playA, playB) : (playB, playA);
        require(getGame[play0][play1][startTime] == address(0), 'GameFactory: GAME_EXISTS');
        bytes32 salt = keccak256(abi.encodePacked(play0, play1));
        address newGame = address(new Game{salt: salt}(play0, play1,startTime));
        getGame[play0][play1][startTime] = newGame;
        
        GameItem memory g = GameItem({
            play0: play0,
            play1: play1,
            startTime: startTime,
            addr: newGame
        });
        allGames.push(g);
        return newGame;
    }
    
    function getAllGames() external view returns  (GameItem[] memory){
        return allGames;
    }

    function _findGame(uint16 playA, uint16 playB,  uint32 startTime) internal view returns(address gameAddr){
        require(playA != playB, 'GameFactory: IDENTICAL_PLAY');
        (uint16 play0, uint16 play1) = playA < playB ? (playA, playB) : (playB, playA);
        address game = getGame[play0][play1][startTime];
        require(game != address(0), 'GameFactory: GAME IS NOT EXIST');
        return game;
    }

    function deposit(uint16 playA, uint16 playB,  uint32 startTime, uint16 _win) external payable{
        require(_win == playA || _win == playB || _win == playA+playB, "invalid team");
        address gameAddr = _findGame(playA, playB, startTime);
        address depositer = msg.sender;
        uint256 amout = msg.value;
        require(IGame(gameAddr).deposit{value:amout}(depositer, _win), "Deposit faild");
    }
    function setWiner(uint16 playA, uint16 playB,  uint32 startTime, uint16 _win) external onlyOwner{
        require(_win == playA || _win == playB || _win == playA+playB, "invalid team");

        address gameAddr = _findGame(playA, playB, startTime);
        require(IGame(gameAddr).setWiner(_win), "setWin faild");
    }

    function sendPrize(uint16 playA, uint16 playB,  uint32 startTime) external onlyOwner{
        address gameAddr = _findGame(playA, playB, startTime);
        require(IGame(gameAddr).sendPrize(), "sendPrize faild");
    }

    function withdraw(uint16 playA, uint16 playB,  uint32 startTime) external onlyOwner{
        address gameAddr = _findGame(playA, playB, startTime);
        IGame(gameAddr).withdraw(payable(msg.sender));
    }
}