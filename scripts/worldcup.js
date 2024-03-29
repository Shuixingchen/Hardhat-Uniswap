const { BigNumber } = require("ethers");
const hre = require("hardhat");
const { parseBytes32String, formatBytes32String,toUtf8Bytes,parseEther } = require("ethers/lib/utils");
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

async function getContract(name, deployer, addr="") {
    if (fs.existsSync("./build/"+hre.network.config.buildName)) {
        rawdata = fs.readFileSync("./build/"+hre.network.config.buildName)
        saveData = JSON.parse(rawdata);
    }
    if (addr === "") {
        addr = saveData[name]
    }
    const factory = await ethers.getContractFactory(name);
    const contract = new ethers.Contract(addr, factory.interface, deployer);
    return contract
}

async function main() {
    const [deployer,account1] = await ethers.getSigners();
    console.log(`deployer: ${deployer.address},  account1: ${account1.address}`)
    // 2.部署合约
    // const FACTORY = await deploy("GameFactory");
    const FACTORY = await getContract("GameFactory", deployer)

    // 3.创建game
    // let t1 = await FACTORY.createGame(1,2,1669003200);
    // let t2 = await FACTORY.createGame(1,2,1669006800);
    // await t1.wait()
    // let game = await FACTORY.getAllGames()
    // console.log(game)
    // 4. 充值下注 小于比赛时间
    // let overrides = {
    //     value: parseEther('0.2'),
    //   };
    // let depositTx = await FACTORY.deposit(1,2,1669003200,1, overrides)
    // depositTx.wait()
    // console.log(depositTx.hash)

    // // 5. 设置比赛结果 大于比赛时间
    // let setTx = await FACTORY.setWiner(1,2,1668680282,1)
    // await setTx.wait()
    // let wins = await FACTORY.getWiners(1,2,1668680282)

    // // 6. 发布奖励
    // let sendTx = await FACTORY.sendPrize(1,2,1668680282)
    // await sendTx.wait()

    // 7. withdraw
    // let withdrawTx = await FACTORY.withdraw(1,2,1668680282)
    // await withdrawTx.wait()

    // 8. getBalance
    // const Game = await getContract("Game", deployer, "0xE0fdA1D9979696283CA8f5d8eEec1662a22c3567")
    // let balance1 = await Game.getBalance(3)
    // console.log(`balance1: ${balance1}`)
    
}
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  