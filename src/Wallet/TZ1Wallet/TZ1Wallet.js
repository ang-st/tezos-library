const Ed25519 = require('ed25519-hd-key');
const TaquitoUtils = require('@taquito/utils');
class TZ1Wallet {
    constructor(seed) {
        this.seed = seed;
        this.rootPath = `m/0`;
    }
    derivePath(){
        const keys = Ed25519.derivePath(this.rootPath, this.seed.toString('hex'));
        const { key } = keys;
        const privateKeyFromSeed =  TaquitoUtils.b58cencode(key.slice(0, 32), TaquitoUtils.prefix.edsk2);
    }
};
module.exports = TZ1Wallet;
