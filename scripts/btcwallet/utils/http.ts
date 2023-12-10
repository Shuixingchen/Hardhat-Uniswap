import axios, { AxiosResponse } from 'axios';
import { string } from 'hardhat/internal/core/params/argumentTypes';

interface UTXO {
  txid: string;
  vout: number;
  scriptPubKey: string;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
  value: number;
}

const httpClient = axios.create({
  baseURL: 'https://mempool.space/testnet/api/', // 根据实际情况更改
});

export async function getUTXO(address: string): Promise<UTXO[]> {
  try {
    const resp = await httpClient.get(`address/${address}/utxo`);
    return resp.data;
  } catch (error) {
    console.error("Error fetching UTXOs: ", error);
    return Promise.reject(error);
  }
}
export async function broadcastTx(rawtx:string){
  try {
    const resp = await httpClient.post('tx',rawtx);
    return resp;
  } catch (error) {
    console.error("Error broadcasting transaction: ", error);
    return Promise.reject(error);
  }
}