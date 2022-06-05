const Ed25519 = require('ed25519-hd-key');
const TaquitoUtils = require('@taquito/utils');
class TZ1Wallet {
    constructor(seed) {
        this.seed = seed;
    }
    derivePath(path){
        const keys = Ed25519.derivePath(path, this.seed.toString('hex'));
        const { key } = keys;
        return TaquitoUtils.b58cencode(key.slice(0, 32), TaquitoUtils.prefix.edsk2);
    }
};
module.exports = TZ1Wallet;
