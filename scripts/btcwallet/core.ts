import  * as bitcoin from 'bitcoinjs-lib';

function BlockFromHex() {
    const block = {
        "id": "000000000000b731f2eef9e8c63173adfb07e41bd53eb0ef0a6b720d6cb6dea4",
        "transactions": 7,
        "hex": ""
      }
    let b = bitcoin.Block.fromHex(block.hex)
    console.log(b.getId())
}

function TransactionFromHex() {
    const txhex = "0100000001f709fa82596e4f908ee331cb5e0ed46ab331d7dcfaf697fe95891e73dac4ebcb000000008c20ca42095840735e89283fec298e62ac2ddea9b5f34a8cbb7097ad965b87568100201b1b01dc829177da4a14551d2fc96a9db00c6501edfa12f22cd9cefd335c227f483045022100a9df60536df5733dd0de6bc921fab0b3eee6426501b43a228afa2c90072eb5ca02201c78b74266fac7d1db5deff080d8a403743203f109fbcabf6d5a760bf87386d20100ffffffff01c075790000000000232103611f9a45c18f28f06f19076ad571c344c82ce8fcfe34464cf8085217a2d294a6ac00000000"
    let t = bitcoin.Transaction.fromHex(txhex)
    console.log(t.getId())
}

TransactionFromHex();