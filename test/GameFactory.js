const { expect } = require("chai");
const { parseBytes32String, formatBytes32String,toUtf8Bytes } = require("ethers/lib/utils");
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
    let mintTx = await factory.createGame(1,2,Math.round(new Date() / 1000));
    console.log(`mintTx: ${mintTx.hash}`);
    mintTx.wait();

    let games = await factory.getGameItem()
    console.log(games);
  });

});
