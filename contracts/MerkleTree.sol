// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MerkleTree is Ownable{
    bytes32 public merkleRoot;
    mapping(address=>bool) hashMint;

    function Mint(bytes32[] calldata _merkleProof) public{
        require(!hashMint[msg.sender], "has minted");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), "poof error");
        hashMint[msg.sender] = true;
        // to do mint
    }

    function SetMerkleRoot(bytes32 _merkleRoot) onlyOwner public {
        merkleRoot = _merkleRoot;
    }
}