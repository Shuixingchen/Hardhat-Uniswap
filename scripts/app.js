
const hre = require("hardhat");

const TokenAddr = "0x960A3bBf923248Fc78D24cC39cAfAA29c7084a2B"

async function ShowToken() {
    const [deployer, account1,account2] = await ethers.getSigners();
    const GameItem = await hre.ethers.getContractFactory("GameItem");
    
    

    // 1. 创建合约对象
    const gameItem = GameItem.attach(TokenAddr)
    // const gameItem = new hre.ethers.Contract(TokenAddr, GameItem.interface, deployer);

    // 2. 调用只读函数
    let name = await gameItem.name()
    console.log(name);

    // 3. 调用非只读函数
    let mintTx = await gameItem.awardItem(account1.address,"http://ddd.com");
    console.log(`mintTx: ${mintTx.hash}`);
    mintTx.wait();
    let tokenURI = await gameItem.tokenURI(2);
    console.log(tokenURI);
}

ShowToken();