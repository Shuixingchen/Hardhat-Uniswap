const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

let saveData = {};
async function DeployUpgradeContract(name, ...arg) {
  const factory = await ethers.getContractFactory(name);
  // 使用upgrade来部署可升级合约
  const contract = await upgrades.deployProxy(factory, ...arg);
  const instance = await contract.deployed();
  SaveAddress(name, instance.address)
  return instance
}

async function UpgradeContract(name, ...arg) {
  // Upgrading
  const factory = await ethers.getContractFactory(name);
  const upgraded = await upgrades.upgradeProxy(saveData[name], factory, ...arg);
  instance = await upgraded.deployed();
  console.log("upgrade proxy implement:",instance.address);
  return instance;
}

async function DeployContract(name, ...arg){
  const factory = await hre.ethers.getContractFactory(name);
  const contract = await factory.deploy(...arg);
  const instance = await contract.deployed();
  SaveAddress(name, instance.address);
  return instance;
}

async function SaveAddress(name,address){
  saveData[name] = address;
  fs.writeFileSync("./build/"+hre.network.config.buildName, JSON.stringify(saveData, null, 4));
}

function GetProxyAddress() {
  if (fs.existsSync("./build/"+hre.network.config.buildName)) {
    rawdata = fs.readFileSync("./build/"+hre.network.config.buildName)
    saveData = JSON.parse(rawdata);
  }
}

async function GetImplementAddress(name) {
  let implemention = await upgrades.erc1967.getImplementationAddress(saveData[name]);
  return implemention;
}


async function main() {
  const [deployer,account1] = await ethers.getSigners();
  GetProxyAddress()

  // 部署可升级合约
  let sportToken = await DeployUpgradeContract("SportToken");
    
  // Upgrading
  // let upgraded = await UpgradeContract("SportToken")
  // let imp = await GetImplementAddress("SportToken")
  // console.log(imp)

}

  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });