// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

let saveData = {};
async function saveAddress(name,address){
    saveData[name] = address;
    fs.writeFileSync("./build/"+hre.network.config.buildName, JSON.stringify(saveData, null, 4));
}
function GetProxyAddress() {
  if (fs.existsSync("./build/"+hre.network.config.buildName)) {
    rawdata = fs.readFileSync("./build/"+hre.network.config.buildName)
    saveData = JSON.parse(rawdata);
  }
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
  const instance = await deploy("PriceConsumerV3");
  console.log("deployed to:", instance.address);

  // 3. 请求合约
  // GetProxyAddress()
  // const factory = await hre.ethers.getContractFactory("PriceConsumerV3");
  // contract = factory.attach(saveData["PriceConsumerV3"])
  // let price = await contract.getLatestPrice()
  // console.log(price)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
