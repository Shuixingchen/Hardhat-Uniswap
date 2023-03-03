// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// 通过这个工厂合约来发布合约，只要bytecode, salt相同，就能得到相同的地址
contract ContractDeployerFactory {
    event ContractDeployed(bytes32 salt, address addr);

    function deployContract(bytes32 salt, bytes memory contractBytecode) public {
        address addr;
        assembly {
            addr := create2(0, add(contractBytecode, 0x20), mload(contractBytecode), salt)
            if iszero(extcodesize(addr)) { revert(0, 0) }
        }
        emit ContractDeployed(salt, addr);
    }

    function deployContractWithConstructor(bytes32 salt, bytes memory contractBytecode, bytes memory constructorArgs) public {
    bytes memory payload = abi.encodePacked(contractBytecode, constructorArgs);
    address addr;
    assembly {
        addr := create2(0, add(payload, 0x20), mload(payload), salt)
        if iszero(extcodesize(addr)) { revert(0, 0) }
    }
    emit ContractDeployed(salt, addr);
}
}

