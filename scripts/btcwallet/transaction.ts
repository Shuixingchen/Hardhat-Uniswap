import  * as bitcoin from 'bitcoinjs-lib';

function FromHex(h :string): bitcoin.Transaction{
    return bitcoin.Transaction.fromHex(h);
}

function main() {
    const h = "0200000000010185cca9ea76d28b1379ea0acb9c5a2ea16e2a71f68f7bd7da9f016a81f887a5ed0100000000fdffffff02804a5d0500000000160014e63d0322f8e8c377ddcb92281534ba567d5bff859c45450600000000160014c828fedee27e6a0fbb23da98f9baa3cf4d5af154024730440220174a6779c4632264ae51f975c992032fa264295b38ba41c809984ac61db8b12302207c3e81a2485c53433a05141f44e5e5cee47e8825a9d71877d5e9adaeb66dd58b012103ff817e1a227e443dcef5a2caeb0eddcdc8509788838b12305cb76433bca710a4727a0c00"
    let tx = FromHex(h);
    // console.log(tx);
    let hh = tx.toHex();
    console.log(hh);
}

main();