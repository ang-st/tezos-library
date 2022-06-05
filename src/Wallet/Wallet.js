const ExplorerAPI = require('../ExplorerAPI/ExplorerAPI');
const Signer = require('@taquito/signer');
const LocalForging = require('@taquito/local-forging');
const LocalForger = require("@taquito/local-forging");
const bip39 = require("bip39");
const TYPED_WALLET = {
    'tz1': require('./TZ1Wallet/TZ1Wallet'),
    'tz2': require('./TZ2Wallet/TZ2Wallet')
};

class Wallet {
    constructor(opts = {}) {
        this.type = opts?.type?.toLowerCase() || 'tz1';
        if(!['tz1','tz2'].includes(this.type)){
            throw new Error('Support limited to TZ1/TZ2');
        }

        const password = (opts.password) ? opts.password : '';
        const mnemonic = (opts.mnemonic) ? opts.mnemonic : this.generateMnemonic();

        const seed = (opts.seed) ? opts.seed : bip39.mnemonicToSeedSync(mnemonic, password)

        this.seed = seed;
        this.explorer = new ExplorerAPI();
    }
    generateMnemonic(){
        const mnemonic = bip39.generateMnemonic();
        this.hasGeneratedMnemonic = true;
        this.exportMnemonic = () => {
            return mnemonic
        }
        return mnemonic;
    }
    async derivePath(path, opts = {}){
        // Path for Tezos (templeos, conseiljs,...)
        let rootPath = "m/44'/1729'/0'/0'"
        if(opts.rootPath){
            rootPath = opts.rootPath;
        }

        const typedWallet = new TYPED_WALLET[this.type](this.seed);
        const derivationPath = `${rootPath}/${path.replaceAll('m/', '')}`;
        const privateKeyFromSeed = typedWallet.derivePath(derivationPath);
        const keySet = await Signer.InMemorySigner.fromSecretKey(privateKeyFromSeed);
        const [publicKey, address, privateKey] = await Promise.all([keySet.publicKey(), keySet.publicKeyHash(), keySet.secretKey()]);

        return {
            path: derivationPath,
            address,
            privateKey,
            publicKey
        };
    }
    async signTransaction(transaction){
        const privateKey = await this.wallet.getPrivateKey();
        const publicKey = await this.wallet.getPublicKey();
        const signer = await new Signer.InMemorySigner(privateKey);
        const {hash: branch} = await this.getBlockHead()
        const isRevealed = await this.isRevealed()

        const contents = [];
        if(!isRevealed){
            const reveal = {
                kind: 'reveal',
                source: transaction.source,
                counter: String(transaction.counter),
                fee: '1270',
                //https://github.com/Cryptonomic/ConseilJS/blob/e07b020ec79615bd052b1cbb764ccc71bb8e0b72/src/types/tezos/TezosConstants.ts
                gas_limit: '1100',
                storage_limit: 0,
                public_key: publicKey,
            }
            transaction.counter = String(parseInt(transaction.counter)+1);
            contents.push(reveal)
        }
        contents.push(transaction);
        const forgedHex = await LocalForger.localForger.forge({branch, contents});
        const signed = await signer.sign(forgedHex, new Uint8Array([3]));
        return signed.sbytes;
    }

    async buildTransaction(opts = {}){
        const {from, to, amount, counter, fees} = opts;
        const transaction = {
            kind: 'transaction',
            counter: String(counter + 1),
            source: from,
            // Tez to Mutez
            fee: String(fees*1e6),
            gas_limit: '10600',
            storage_limit: '496',
            destination: to,
            // Tez to Mutez
            amount: String(amount*1e6),
        };
        return transaction
    }
};
module.exports = Wallet;
