const bip32 = require('bip32');
const TaquitoUtils = require('@taquito/utils');
class TZ2Wallet {
    constructor(seed) {
        this.seed = seed;
        this.rootPath = `m/0`;
    }
    derivePath(){
        const rootKey = bip32.fromSeed(this.seed);
        const derivedKey = rootKey.derivePath(this.rootPath);
        const privateKeyFromSeed =  TaquitoUtils.b58cencode(derivedKey.privateKey.slice(0, 32), TaquitoUtils.prefix.spsk);
    }
};
module.exports = TZ2Wallet;
