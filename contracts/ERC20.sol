// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, ERC20Burnable, Ownable {
    uint8 private _decimals;
    constructor(
        string memory name, 
        string memory symbol, 
        uint8 dec
    )
        ERC20(name, symbol)
        Ownable()
    {
        _decimals = dec;
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
     // 修改燃烧函数以使其付费
    function burnWithPayment(uint256 amount) public payable {
        require(msg.value > 0, "Insufficient payment.");
        address payable contractOwner = payable(owner());
        // 将付款转给所有者
        contractOwner.transfer(msg.value);
        // 燃烧代币
        burn(amount);
    }
}
