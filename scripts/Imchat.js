const { BigNumber } = require("ethers");
const hre = require("hardhat");
const { web3, ethers } = require("hardhat");
const fs = require("fs");

let saveData = {};
function GetProxyAddress() {
    if (fs.existsSync("./build/"+hre.network.config.buildName)) {
      rawdata = fs.readFileSync("./build/"+hre.network.config.buildName)
      saveData = JSON.parse(rawdata);
    }
}

async function GetInstance(name, wallet) {
  const factory = await ethers.getContractFactory(name);
  let instance = new ethers.Contract(saveData[name] , factory.interface , wallet );
  return instance
}

async function main(){
    GetProxyAddress();
    const [deployer] = await ethers.getSigners();
    let IMCToken =  await GetInstance("IMCToken", deployer);
    await showERC20Token(IMCToken,deployer)
}

async function showERC20Token(instance,wallet) {
  let name = await instance.name();
  let symbol =await instance.symbol();
  let totalSupply = await instance.totalSupply();
  let decimal = await instance.decimals();
  let balance = await instance.balanceOf(wallet.address);
  console.log(`name:${name},symbol: ${symbol},decimal:${decimal},totalSupply:${totalSupply}`)
  console.log(`address: ${wallet.address}: ${balance}`);
}

async function showNFT(instance) {
  let name = await instance.name();
  let symbol = await instance.symbol();
  console.log(`name:${name},symbol: ${symbol}`)
}


main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
