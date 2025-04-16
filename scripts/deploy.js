async function main() {
    // 获取合约工厂
    const ContractFactory = await hre.ethers.getContractFactory("BEP40Token");
  
    // 部署合约
    const contract = await ContractFactory.deploy();
  
    // 等待合约部署事务被确认
    await contract.deployed();
  
    console.log("Contract deployed to:", contract.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  