import * as fixtures from './feature/address.json';
import  * as bitcoin from 'bitcoinjs-lib';

const TESTNET = bitcoin.networks.testnet;
const MAINNET = bitcoin.networks.bitcoin;

let standerAddr = {
  "network": "bitcoin",
  "version": 0,
  "hash": "751e76e8199196d454941c45d1b3a323f1433bd6",
  "base58check": "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH",
  "script": "OP_DUP OP_HASH160 751e76e8199196d454941c45d1b3a323f1433bd6 OP_EQUALVERIFY OP_CHECKSIG"
}
let scriptAddr =  {
  "network": "bitcoin",
  "version": 5,
  "hash": "cd7b44d0b03f2d026d1e586d7ae18903b0d385f6",
  "base58check": "3LRW7jeCvQCRdPF8S3yUCfRAx4eqXFmdcr",
  "script": "OP_HASH160 cd7b44d0b03f2d026d1e586d7ae18903b0d385f6 OP_EQUAL"
}
// 解码base58check
// address => version, hash
function base58Check() {
    let base58CheckRes = bitcoin.address.fromBase58Check(standerAddr.base58check);
    console.log(`base58CheckRes.version = ${base58CheckRes.version}, hash = ${base58CheckRes.hash.toString()} \n`)
}
function scriptToAddr() {

}
scriptToAddr();