const { BigNumber } = require("ethers");
const hre = require("hardhat");
const { web3 } = require("hardhat");
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
  // 1.获取部署钱包
  const [deployer] = await ethers.getSigners();
  console.log(`deployer: ${deployer.address}` );
  // 2.部署合约
  WETHADDR = "0xc778417E063141139Fce010982780140Aa0cD5Ab"
  const factory = await deploy("UniswapV3Factory", deployer.address)
  const positionManager = await deploy("NonfungiblePositionManager",factory.address, WETHADDR)
  const router = await deploy("SwapRouter", factory.address, WETHADDR)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
