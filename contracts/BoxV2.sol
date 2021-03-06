// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BoxV2 {
    uint256 private _value;

    function store(uint256 value) public {
        _value = value;
    }

    function retrieve() public view returns (uint256) {
        return _value;
    }
    function Add(uint256 value) public view returns (uint256){
        uint256 res = _value+value;
        return res;
    }
}
