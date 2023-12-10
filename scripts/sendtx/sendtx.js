// 引入硬帽和 ethers.js
const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  // 获取发送者的钱包
  const [signer] = await ethers.getSigners();
  let gasPrice = await signer.getGasPrice();
  let nonce = await signer.getTransactionCount();
  let balance = await signer.getBalance();
  console.log(`address: ${signer.address}, balance: ${balance}, gasPrice: ${gasPrice}, nonce: ${nonce}`)
  // 构造交易
  const txn = {
    to: "0x9d2277823984e0ced745dbd7f500d89d41f39829", // 收件人地址
    value: ethers.utils.parseEther("0.1"), // 发送的 ETH 数量
    data: "0x", // 可选: 调用合约函数的 ABI 编码数据
    gasLimit: 21000, // 可选: gas 限制
    gasPrice: 15000000000,
    nonce: 4
  };

  const txResponse = await signer.sendTransaction(txn);
  console.log(`txhash: ${txResponse.hash}`)

  const receipt = await txResponse.wait();
  console.log(receipt)

}

// 我们建议这种模式来处理异步性，因为它可以捕获并显示 console 中的错误
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
