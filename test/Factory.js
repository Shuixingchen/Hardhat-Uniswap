const { expect } = require("chai");
const { parseBytes32String, formatBytes32String,toUtf8Bytes } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

// 测试用例
describe("Factory", function () {
  let factory; // 全局对象，合约对象

  beforeEach(async () => {
    // 1.部署合约
    const Factory = await ethers.getContractFactory("Factory");
    factory = await Factory.deploy();
    await factory.deployed();
  });
  
  // 3. 请求非只读函数
  it("create contract", async function() {
    const [deploy, account1,account2] = await ethers.getSigners();
    let mintTx = await factory.deploy(account1.address,10,formatBytes32String("aaa"));
    console.log(`mintTx: ${mintTx.hash}`);
    mintTx.wait();
  });
});

// 测试用例
describe("FactoryAssembly", function () {
    let factory; // 全局对象，合约对象
  
    beforeEach(async () => {
      // 1.部署合约
      const Factory = await ethers.getContractFactory("FactoryAssembly");
      factory = await Factory.deploy();
      await factory.deployed();
    });
    
    // 3. 请求非只读函数
    it("create contract", async function() {
      const [deploy, account1,account2] = await ethers.getSigners();
      await factory.getAddress(account1.address,10, formatBytes32String("aaa"));
      await factory.deploy(account1.address,10, formatBytes32String("aaa"));
    });
  });
  