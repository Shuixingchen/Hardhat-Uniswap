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
    let phrase = "wave hotel tuition post pilot usage sugar exclude bright plunge conduct around"
    let wallet = hre.ethers.Wallet.fromMnemonic(phrase)
    console.log("private:",wallet.privateKey)
    console.log("address:", wallet.address)
    console.log("mnemonic:",await wallet._mnemonic())
}

// 通过私钥找回助记词
async function GetWalletFromPrivate() {
    let privateKey = "0xaca02ca658997ebb7a53895e7b5b3aae35a19d1f77ca2ccd6999d8b5e5b1064c";
    let wallet = new ethers.Wallet(privateKey);
    console.log("private:",wallet.privateKey)
    console.log("address:", wallet.address)
    console.log("mnemonic:",await wallet._mnemonic())
}

// main();
// CreateWallet()
// GetWalletFromMnemonic()
GetWalletFromPrivate()