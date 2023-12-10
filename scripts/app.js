
const { ethers } = require("hardhat");

const TokenAddr = "0xF914418E638036969d937d1F7B00A1C94e90c4Ce"

async function ShowToken() {
    // 读取当前的账户
    const [deployer, account1,account2] = await ethers.getSigners();
    console.log(deployer)

    const Contract = await ethers.getContractFactory("Oracle");
    
    // 1. 创建合约对象
    const oracle = Contract.attach(TokenAddr)
    // const gameItem = new hre.ethers.Contract(TokenAddr, GameItem.interface, deployer);

    // 2. 调用只读函数
    // let name = await oracle.name()
    // console.log(name);

    // 3. 调用非只读函数
    let mintTx = await oracle.fulfillOracleRequest2();
    console.log(`mintTx: ${mintTx.hash}`);
    mintTx.wait();
    let tokenURI = await gameItem.tokenURI(2);
    console.log(tokenURI);
}

ShowToken();