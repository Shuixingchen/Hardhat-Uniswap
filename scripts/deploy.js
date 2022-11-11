// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // 1.获取部署钱包
  const [deployer] = await ethers.getSigners();
  console.log(`deployer: ${deployer.address}` );

  // 2.部署合约
  const Deposit = await ethers.getContractFactory("DepositContract");
  let deposit = await Deposit.deploy();
  await deposit.deployed();
  console.log("deposit deployed to:", deposit.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
