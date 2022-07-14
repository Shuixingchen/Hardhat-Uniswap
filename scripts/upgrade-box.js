
// 部署可升级合约 npm install --save-dev @openzeppelin/hardhat-upgrades
const { ethers, upgrades } = require("hardhat");

// 使用透明代理做升级

async function main() {
    const [deployer,account1] = await ethers.getSigners();
    console.log(`deployer: ${deployer.address}, account1: ${account1.address}` );

    // 部署可升级合约
    // const BoxToken = await ethers.getContractFactory("Box");
    // const boxToken = await upgrades.deployProxy(BoxToken);
    // await boxToken.deployed();
    // console.log("proxy address:", boxToken.address);

    // 升级合约
    const proxyAddr = "0x9A84b3591dB577E6B6C02d0088aBC20Ac0880491";
    // const BoxTokenV2 = await ethers.getContractFactory("BoxV2");
    // const boxToken = await upgrades.upgradeProxy(proxyAddr,BoxTokenV2);
    // console.log("proxy address:", boxToken.address);

    // 修改升级的admin
    await upgrades.admin.transferProxyAdminOwnership(account1.address);
    // console.log("Transferred ownership of ProxyAdmin to:", account1.address);

    console.log(await upgrades.erc1967.getImplementationAddress(proxyAddr)," getImplementationAddress") // 逻辑合约地址
    console.log(await upgrades.erc1967.getAdminAddress(proxyAddr)," getAdminAddress") // proxAdmin合约地址
}

  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });