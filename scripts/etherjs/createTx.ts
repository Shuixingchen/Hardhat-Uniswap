import { ethers } from "hardhat";

async function main() {
    const [signer1] = await ethers.getSigners();
    console.log("account:", signer1.address);
    let sig = await signer1.signMessage("tWApUy3F4MGryOCKAKGJ");
    console.log("sig:", sig);
    // const tx = {
    //     to:"0x0000000000000000000000000000000000000000",
    //     value: ethers.utils.parseEther("0.000000000000000000"),
    //     data: "0x",
    //     gasLimit: 21000,
    //     gasPrice: ethers.utils.parseUnits("100", "gwei"),
    //     nonce: 0,
    // }
    // signer1.sendTransaction(tx);
}

main();