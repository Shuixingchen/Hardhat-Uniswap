const { expect } = require("chai");
const { ethers } = require("hardhat");

// 测试用例
describe("GameItem", function () {
  let gameItem; // 全局对象，合约对象

  beforeEach(async () => {
    // 1.部署合约
    const GameItem = await ethers.getContractFactory("GameItem");
    gameItem = await GameItem.deploy("GameItem", "GG");
    await gameItem.deployed();
  });
  
  // 2.请求只读函数
  it("read from contract", async function () {
    expect(await gameItem.name()).to.equal("GameItem");
    expect(await gameItem.symbol()).to.equal("GG");
  });

  // 3. 请求非只读函数
  it("write to contract", async function() {
    const [deploy, account1,account2] = await ethers.getSigners();
    let mintTx = await gameItem.awardItem(account1.address,"http://ddd.com");
    console.log(`mintTx: ${mintTx.hash}`);
    mintTx.wait();
    let tokenURI = await gameItem.tokenURI(1);
    expect(tokenURI).to.equal("http://ddd.com")
  });
});
