
// 部署可升级合约 npm install --save-dev @openzeppelin/hardhat-upgrades
const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer,account1] = await ethers.getSigners();
    console.log(`deployer: ${deployer.address}, account1: ${account1.address}` );

    // 部署可升级合约
    // const SportToken = await ethers.getContractFactory("SportToken");
    // const sportToken = await upgrades.deployProxy(SportToken);
    // await sportToken.deployed();
    // console.log("proxy address:", sportToken.address);

    // 升级合约
    // const proxyAddr = "0xc76eBDD555dec649FE93503dDd3901c14060e008";
    // const SportTokenV2 = await ethers.getContractFactory("SportTokenV2");
    // const sportToken = await upgrades.upgradeProxy(proxyAddr,SportTokenV2);
    // console.log("Token address:", sportToken.address);

    // 修改升级的admin
    await upgrades.admin.transferProxyAdminOwnership(account1.address);
    console.log("Transferred ownership of ProxyAdmin to:", account1.address);

}

  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });