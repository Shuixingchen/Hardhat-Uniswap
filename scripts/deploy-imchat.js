const { BigNumber } = require("ethers");
const hre = require("hardhat");
const { web3, ethers } = require("hardhat");
const fs = require("fs");

let saveData = {};
async function saveAddress(name,address){
    saveData[name] = address;
    fs.writeFileSync("./build/"+hre.network.config.buildName, JSON.stringify(saveData, null, 4));
}

async function deploy(name, ...arg){
    const factory = await hre.ethers.getContractFactory(name);
    const contract = await factory.deploy(...arg);
    const instance = await contract.deployed();
    saveAddress(name, instance.address);
    return instance;
}


async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`deployer: ${deployer.address}` );
    platformAddr = deployer.address;
    // 2.部署合约
    // 发布IMCToken合约
    IMCToken = await deploy("IMCToken");
    // 发布IMCIssuingRecord合约
    IMCIssuingRecord = await deploy("IMCIssuingRecord",IMCToken.address,platformAddr);
    // 允许IMCIssuingRecord地址访问IMCToken合约
    approveTx =  await IMCToken.approveContractCall(IMCIssuingRecord.address);
    // 发布IMCUnlockRecord合约
    IMCUnlockRecord = await deploy("IMCUnlockRecord");
    // 发布IMCLedgerRecord合约
    IMCLedgerRecord = await deploy("IMCLedgerRecord");
}
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  