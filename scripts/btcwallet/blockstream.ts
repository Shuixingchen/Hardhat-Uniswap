import axios, { AxiosResponse } from "axios";
import ECPairFactory from 'ecpair';
import  * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';

const TESTNET = bitcoin.networks.testnet;
const ECPair = ECPairFactory(ecc);

const blockstream = new axios.Axios({
    baseURL: `https://blockstream.info/testnet/api`
});

export async function waitUntilUTXO(address: string) {
    return new Promise<IUTXO[]>((resolve, reject) => {
        let intervalId: any;
        const checkForUtxo = async () => {
            try {
                const response: AxiosResponse<string> = await blockstream.get(`/address/${address}/utxo`);
                const data: IUTXO[] = response.data ? JSON.parse(response.data) : undefined;
                console.log(data);
                if (data.length > 0) {
                    resolve(data);
                    clearInterval(intervalId);
                }
            } catch (error) {
                reject(error);
                clearInterval(intervalId);
            }
        };
        intervalId = setInterval(checkForUtxo, 10000);
    });
}

export async function broadcast(txHex: string) {
    const response: AxiosResponse<string> = await blockstream.post('/tx', txHex);
    return response.data;
}

// 随机生成payment对象
// createPaymetRandom("p2pk")
export function createPaymentRandom(_type: string, myKeys?: any[], network?: any): any {
    network = network? network: TESTNET;
    const splitType = _type.split('-').reverse();
    const isMultisig = splitType[0].slice(0, 4) === 'p2ms';
    const keys = myKeys || [];
    let m: number | undefined;
    if (isMultisig) {
      const match = splitType[0].match(/^p2ms\((\d+) of (\d+)\)$/);
      m = parseInt(match![1], 10);
      let n = parseInt(match![2], 10);
      if (keys.length > 0 && keys.length !== n) {
        throw new Error('Need n keys for multisig');
      }
      while (!myKeys && n > 1) {
        keys.push(ECPair.makeRandom({ network }));
        n--;
      }
    }
    if (!myKeys) keys.push(ECPair.makeRandom({ network }));
  
    let payment: any;
    splitType.forEach(type => {
      if (type.slice(0, 4) === 'p2ms') {
        payment = bitcoin.payments.p2ms({
          m,
          pubkeys: keys.map(key => key.publicKey).sort((a, b) => a.compare(b)),
          network,
        });
      } else if (['p2sh', 'p2wsh'].indexOf(type) > -1) {
        payment = (bitcoin.payments as any)[type]({
          redeem: payment,
          network,
        });
      } else {
        payment = (bitcoin.payments as any)[type]({
          pubkey: keys[0].publicKey,
          network,
        });
      }
    });
  
    return {
      payment,
      keys,
    };
}

export function createPaymentWIF(privateKey: string): any {
    // 通过私钥生成地址
    const keyPair = ECPair.fromWIF(
        privateKey,
      );
    return bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
}

interface IUTXO {
    txid: string;
    vout: number;
    status: {
        confirmed: boolean;
        block_height: number;
        block_hash: string;
        block_time: number;
    };
    value: number;
}