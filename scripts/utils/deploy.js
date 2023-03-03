const hre = require("hardhat");
const fs = require("fs");


function readDeployedAddr() {
    let saveData = {}
    if (fs.existsSync("./build/"+hre.network.config.buildName)) {
        let rawdata = fs.readFileSync("./build/"+hre.network.config.buildName)
        saveData = JSON.parse(rawdata);
    }
    return saveData;
}

function saveAddress(name, address){
    let saveData = readDeployedAddr();
    saveData[name] = address;
    fs.writeFileSync("./build/"+hre.network.config.buildName, JSON.stringify(saveData, null, 4));
}

async function deployContract(contractName, ...arg) {
    const factory = await hre.ethers.getContractFactory(contractName);
    const contract = await factory.deploy(...arg);
    const instance = await contract.deployed();
    saveAddress(contractName, instance.address);
    return instance;
}

module.exports={readDeployedAddr, saveAddress, deployContract}