import ECPairFactory from 'ecpair';
import  * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';

const ECPair = ECPairFactory(ecc);

function CreateAddressRandom() {
    const keyPair = ECPair.makeRandom();
    // 通过public key生成地址
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    console.log(address)
}
function CreateAddressWIF() {
    // 通过私钥生成地址
    const keyPair = ECPair.fromWIF(
        'KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn',
      );
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
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
}
// CreateAddressRandom();
// CreateAddressWIF();
CreateMutilSigAddr();