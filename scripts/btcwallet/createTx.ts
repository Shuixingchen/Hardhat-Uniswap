import ECPairFactory from 'ecpair';
import  * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import BIP32Factory from 'bip32';
import { waitUntilUTXO,broadcast,createPaymentRandom,createPaymentWIF } from './blockstream';

const TESTNET = bitcoin.networks.testnet;
const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);

// 是一个闭包函数，返回bool
const validator = (
    pubkey: Buffer,
    msghash: Buffer,
    signature: Buffer,
  ): boolean => ECPair.fromPublicKey(pubkey).verify(msghash, signature);

function CreateTx() {
    const alice = ECPair.fromWIF(
        'L2uPYXe17xSTqbCjZvL2DsyXPCbXspvcu5mHLDYUgzdUbZGSKrSr',
      );
    const psbt = new bitcoin.Psbt();
    psbt.addInput({
        // if hash is string, txid, if hash is Buffer, is reversed compared to txid
        hash: '7d067b4a697a09d2c3cff7d4d9506c9955e93bff41bf82d439da7d030382bc3e',
        index: 0,
        sequence: 0xffffffff, // These are defaults. This line is not needed.
        // non-segwit inputs now require passing the whole previous tx as Buffer
        nonWitnessUtxo: Buffer.from(
          '0200000001f9f34e95b9d5c8abcd20fc5bd4a825d1517be62f0f775e5f36da944d9' +
            '452e550000000006b483045022100c86e9a111afc90f64b4904bd609e9eaed80d48' +
            'ca17c162b1aca0a788ac3526f002207bb79b60d4fc6526329bf18a77135dc566020' +
            '9e761da46e1c2f1152ec013215801210211755115eabf846720f5cb18f248666fec' +
            '631e5e1e66009ce3710ceea5b1ad13ffffffff01' +
            // value in satoshis (Int64LE) = 0x015f90 = 90000
            '905f010000000000' +
            // scriptPubkey length
            '19' +
            // scriptPubkey
            '76a9148bbc95d2709c71607c60ee3f097c1217482f518d88ac' +
            // locktime
            '00000000',
          'hex',
        ),

      // // If this input was segwit, instead of nonWitnessUtxo, you would add
      // // a witnessUtxo as follows. The scriptPubkey and the value only are needed.
      // witnessUtxo: {
      //   script: Buffer.from(
      //     '76a9148bbc95d2709c71607c60ee3f097c1217482f518d88ac',
      //     'hex',
      //   ),
      //   value: 90000,
      // },

      // Not featured here:
      //   redeemScript. A Buffer of the redeemScript for P2SH
      //   witnessScript. A Buffer of the witnessScript for P2WSH
    });

    psbt.addOutput({
        address: '1KRMKfeZcmosxALVYESdPNez1AP1mEtywp',
        value: 80000,
      });
    psbt.signInput(0, alice);
    psbt.validateSignaturesOfInput(0, validator);
    psbt.finalizeAllInputs();
    console.log(psbt.extractTransaction().toHex());
}

async function CreateOP_RETURN(){
    const alice1 = createPaymentWIF("");

    const data = Buffer.from('bitcoinjs-lib', 'utf8');
    const embed = bitcoin.payments.embed({ data: [data] });

    const utxos = await waitUntilUTXO(alice1.address!)
    const psbt = new bitcoin.Psbt({ network: TESTNET })
      .addInput({
        hash: utxos[0].txid,
        index: utxos[0].vout,
      })
      .addOutput({
        script: embed.output!,
        value: 1000,
      })
      .addOutput({
        address: "tb1qjjg0vkl7u09u4570hduzsfwal2p8vf38asuz0k",
        value: 1e5,
      })
      .signInput(0, alice1.keys[0]);

    if (!psbt.validateSignaturesOfInput(0, validator)) {
        return 
    }
    psbt.finalizeAllInputs();
    // build and broadcast to the RegTest network
    await broadcast(psbt.extractTransaction().toHex());
}

function getWitnessUtxo(out: any): any {
  delete out.address;
  out.script = Buffer.from(out.script, 'hex');
  return out;
}

CreateOP_RETURN();