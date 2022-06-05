const secp256k1 = require('tiny-secp256k1')
const bip32 = require('bip32').BIP32Factory(secp256k1)
const TaquitoUtils = require('@taquito/utils');
class TZ2Wallet {
    constructor(seed) {
        this.seed = seed;
        this.rootPath = `m/0`;
    }
    derivePath(path){
        const rootKey = bip32.fromSeed(this.seed);
        const derivedKey = rootKey.derivePath(this.rootPath);
        const privateKeyFromSeed =  TaquitoUtils.b58cencode(derivedKey.privateKey.slice(0, 32), TaquitoUtils.prefix.spsk);
        return privateKeyFromSeed;
    }
};
module.exports = TZ2Wallet;
