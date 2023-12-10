import { getUTXO,broadcastTx } from './utils/http';
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import { Network } from 'bitcoinjs-lib/src/types';

const NETWORK = bitcoin.networks.testnet;
// const MAINNET = bitcoin.networks.bitcoin;
const ECPair = ECPairFactory(ecc);
const Address = "mreH4ZcQntJ74MyaWJ3sJFKvNzySMZ3nz4"
const PrivateKey = "cP7LogpaqFL64SzTh4p9rPnguVbd7nzob7tYheJh1t676HixJ1TD"
const keyPair = ECPair.fromWIF(PrivateKey, NETWORK);
const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: NETWORK });
console.log(p2wpkh.output?.toString('hex'))

const validator = (
  pubkey: Buffer,
  msghash: Buffer,
  signature: Buffer,
): boolean => ECPair.fromPublicKey(pubkey).verify(msghash, signature);

const schnorrValidator = (
  pubkey: Buffer,
  msghash: Buffer,
  signature: Buffer,
): boolean => ecc.verifySchnorr(msghash, pubkey, signature);

async function CreateTx() {
  try{
   let utxos = await getUTXO(Address)
    const psbt = new bitcoin.Psbt({network:NETWORK});
    console.log(utxos)
    // 添加输入
    for (const utxo of utxos) {
      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: {
          script: p2wpkh.output!,
          value: utxo.value,
        },
      });
    }
    // 添加输出
    psbt.addOutput({
      address: "tb1qcxe370vzdmf99hxctj526cmph8jym7pcxuc29l",
      value: 999,
    });

    psbt.signAllInputs(keyPair); // 使用你的私钥签名交易
    psbt.finalizeAllInputs();

    // 提取交易
    const tx = psbt.finalizeAllInputs().extractTransaction();
    console.log(tx.toHex());
    // 广播交易
    // let res = await broadcastTx(tx.toHex());
    // console.log(res)
  } catch (error) {
    console.error("Error creating transaction: ", error);
  }
}

CreateTx();