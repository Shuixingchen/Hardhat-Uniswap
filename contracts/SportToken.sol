// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract SportToken is Initializable, ERC20Upgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    mapping(address=>uint256) public mintLimit;
    
    event SetMintLimit(address indexed minter, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() initializer public {
        __ERC20_init("SportToken", "ST");
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
    }

    function setMintLimit(address minter, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE){
        mintLimit[minter] = amount;

        emit SetMintLimit(minter, amount);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(amount <= mintLimit[msg.sender], "overlimit");
        mintLimit[msg.sender] -= amount;
        _mint(to, amount);
    }

    function mintByDeadline(address to, uint256 amount, uint256 blockNum) public onlyRole(MINTER_ROLE){
        require(block.number <= blockNum, "overblock!");
        mint(to,amount);
    }

    function burn(uint256 amount) public onlyRole(MINTER_ROLE){
        _burn(_msgSender(), amount);
    }

    function burnByDeadline(uint256 amount, uint256 blockNum) public onlyRole(MINTER_ROLE){
        require(block.number <= blockNum, "overblock!");
        burn(amount);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}
}