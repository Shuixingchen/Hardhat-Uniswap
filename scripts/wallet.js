const { BigNumber } = require("ethers");
const hre = require("hardhat");
const { web3 } = require("hardhat");
const fs = require("fs");

// 通过随机数生成私钥
async function CreateWallet() {
    let wallet = hre.ethers.Wallet.createRandom()
    console.log("private:",wallet.privateKey)
    console.log("address:", wallet.address)
    console.log("mnemonic:",await wallet._mnemonic())
}
// 通过助记词找回钱包
async function GetWalletFromMnemonic() {
    let phrase = "deny mushroom pledge movie number chef oval annual gas attend fence beauty"
    let wallet = hre.ethers.Wallet.fromMnemonic(phrase)
    console.log("private:",wallet.privateKey)
    console.log("address:", wallet.address)
    console.log("mnemonic:",await wallet._mnemonic())
}

// main();
// CreateWallet()
GetWalletFromMnemonic()