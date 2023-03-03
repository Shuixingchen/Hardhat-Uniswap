const { BigNumber } = require("ethers");
const hre = require("hardhat");
const{readDeployedAddr, saveAddress, deployContract} = require('./utils/deploy');

/** 
 * 不同的链部署的合约地址相同
 * 1. 先部署ContractDeployerFactory合约
 * 2. 编译获取待部署合约bytecode, salt, arg
 * 3. 调用DeployerFactory合约的deployContract方法，部署目标合约
*/

async function main() {
  // 1. 获取ContractDeployerFactory地址，如果不存在就部署
  let addresses = readDeployedAddr("ContractDeployerFactory");
  let deployerFactoryAddr = addresses["ContractDeployerFactory"];
  if (deployerFactoryAddr == undefined) {
    const instance =  await deployContract("ContractDeployerFactory")
    deployerFactoryAddr = instance.address;
  }
  // 2.获取DeployerFactory合约对象
  const Contract = await hre.ethers.getContractFactory("ContractDeployerFactory");
  const deployerFactory = Contract.attach(deployerFactoryAddr)
 
  // 3.获取目标合约的bytecode,salt,arg
  const factory = await hre.ethers.getContractFactory("Box")

  // 4.计算合约地址，因为都是通过create2创建的
  calculateSalt(factory.bytecode, deployerFactoryAddr)

    // 使用DeployerFactory发布合约
    // const deployTx = await deployerFactory.deployContract(hre.ethers.utils.formatBytes32String(salt),factory.bytecode)
    // console.log(`mintTx: ${deployTx.hash}`);
    // deployTx.wait();
  // mubai: 0xd15e0f8161de488fb55663a12c95d0470ca45adb
  // bsctest: 0x55990410875983ce10f247aa4edf709711eed46d
}

function calculateSalt(bytecode, deployerFactoryAddr) {
  let bytecodeHash = hre.ethers.utils.keccak256(bytecode).toString('hex')
  // 寻找特定的salt:
  for (let i = 0; i< 0xfffffff; i++) {
    let salt = i.toString(16).padStart(64, '0');
    // 用deployerFactoryAddr, salt和bytecodeHash计算payload:
    let payload = 'ff' + deployerFactoryAddr + salt + bytecodeHash;
    // 计算合约地址:
    let addr = hre.ethers.utils.bufferToHex(hre.ethers.utils.keccak256(payload)).substr(26);
  // 如果以指定前缀开头则找到特定的salt:
  if (addr.startsWith('fe')) {
      console.log(salt);
      console.log(addr);
      break;
  }
}

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
