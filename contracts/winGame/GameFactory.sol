// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
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

    function deposit(uint16 playA, uint16 playB,  uint32 startTime) external{
        require(playA != playB, 'GameFactory: IDENTICAL_PLAY');
        (uint16 play0, uint16 play1) = playA < playB ? (playA, playB) : (playB, playA);
        require(getGame[play0][play1][startTime] != address(0), 'GameFactory: GAME IS NOT EXIST');
        address gameAddr = getGame[play0][play1][startTime];
        address depositer = msg.sender;
        uint256 amout = msg.value;

        
    }


}