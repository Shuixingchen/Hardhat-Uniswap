import ECPairFactory from 'ecpair';
import  * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import bs58check from 'bs58check'

const NETWORK = bitcoin.networks.testnet;
// const NETWORK = bitcoin.networks.bitcoin;
const ECPair = ECPairFactory(ecc);

function CreateAddressRandom() {
    const keyPair = ECPair.makeRandom({network: NETWORK});
    console.log("pubkey=",keyPair.publicKey.toString('hex'))
    console.log("privkey=",keyPair.toWIF())
    // 通过public key生成地址
    const pay1 = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: NETWORK });
    const pay2 = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: NETWORK });
    console.log(`p2pkh: ${pay1.address}\n`, `segwit 地址: ${pay2.address}`)
}
function CreateAddressWIF() {
    // 通过私钥生成地址
    const keyPair = ECPair.fromWIF(
        'cStXoX7W17HD7WdvuDDk7paR9V1E3M5NsgUssqjTzUdZnL9o1HNd',
        NETWORK
      );
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: NETWORK });
    console.log(address)
}
function CreateMutilSigAddr() {
    // 生成 3-2多钱地址
    const pubkeys = [
        '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
        '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
        '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
      ].map(hex => Buffer.from(hex, 'hex'));
    const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ m: 2, pubkeys }),
      });
    console.log(address)
}

// pukey 创建p2pkh地址原理
/**
 * 1.生成一个公钥
 * 2.对pukey进行hash160运算(包含了两次hash, 第一次是SHA-256, 第二次是RIPEMD-160)
 * 3.第3步结果加上前缀符，btc主网前缀是00
 * 4. base58check编码得到地址
 */

function Createp2pkh() {
  const p2pkhAddr = {
    "pubkey":"0351cf6926a33c2e856a661490f58f9144bccae7242c948a8b9ee2e8916f2fcb63",
    "address":"19deffq4pJG4uiffdYWQLc39fRukYNQY2p"
  }
  const hash160 = bitcoin.crypto.hash160(Buffer.from(p2pkhAddr.pubkey, 'hex'));// SHA-256 的结果传递给 RIPEMD-160 哈希函数
  const payload = Buffer.allocUnsafe(21); // 申请21 byte
  payload.writeUInt8(NETWORK.pubKeyHash, 0); // 在0个字节写入前缀符，
  hash160.copy(payload, 1); // 然后把hash160的结果复制到1个字节之后
  let address = bs58check.encode(payload); // 通过base58check编码
  console.log(address)
}
CreateAddressRandom();
// CreateAddressWIF();
// CreateMutilSigAddr();
// Createp2pkh();