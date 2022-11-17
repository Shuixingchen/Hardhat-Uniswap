const { expect } = require("chai");
const { parseBytes32String, formatBytes32String,toUtf8Bytes,parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

// 测试用例
describe("Factory", function () {
  let factory; // 全局对象，合约对象

  beforeEach(async () => {
    // 1.部署合约
    const Factory = await ethers.getContractFactory("GameFactory");
    factory = await Factory.deploy();
    await factory.deployed();
  });
  
  it("create Game", async function() {
    const [deploy, account1,account2] = await ethers.getSigners();
    let mintTx1 = await factory.createGame(1,2,1668668700);
    let mintTx2 = await factory.createGame(1,2,1669006800);
    mintTx1.wait();
    mintTx2.wait();

    let games = await factory.getAllGames()
    console.log(games);
    // 充值
    let overrides = {
      value: parseEther('1'),
    };
    let depositTx1 = await factory.deposit(1,2,1668668700,1, overrides);
    let depositTx2 = await factory.connect(account1).deposit(1,2,1668668700,2, overrides);
    depositTx1.wait()
    depositTx2.wait()
    // 设置比赛结果
    let setWinTx = await factory.setWiner(1,2,1668668700,1)
    setWinTx.wait()
    // 获取赢家
    let wins = await factory.getWiners(1,2,1668668700)
    console.log(wins)

  });

});
