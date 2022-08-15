const ExplorerAPI = require('../ExplorerAPI/ExplorerAPI');
const RPCClient = require('../RPCClient/RPCClient');
const Signer = require('@taquito/signer');
const LocalForging = require('@taquito/local-forging');
const LocalForger = require("@taquito/local-forging");
const bip39 = require("bip39");
const tezToMutez = require('../utils/tezToMutez');
const CONSTANTS = require('../CONSTANTS');
const TYPED_WALLET = {
    'tz1': require('./TZ1Wallet/TZ1Wallet'),
    'tz2': require('./TZ2Wallet/TZ2Wallet')
};

class Wallet {
    constructor(opts = {}) {
        this.type = opts.type || 'tz1';
        if(!['tz1','tz2'].includes(this.type)){
            throw new Error('Support limited to TZ1/TZ2');
        }

        const password = (opts.password) ? opts.password : '';
        const mnemonic = (opts.mnemonic) ? opts.mnemonic : this.generateMnemonic();

        const seed = (opts.seed) ? opts.seed : bip39.mnemonicToSeedSync(mnemonic, password)

        this.seed = seed;
        this.explorer = new ExplorerAPI();
        this.rpc = new RPCClient();
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
        const derivationPath = `${rootPath}/${path.replace('m/', '')}`;
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
    async signTransaction(transaction, opts = {}){
        const privateKey = opts.privateKey;
        const publicKey = opts.publicKey;
        const signer = await new Signer.InMemorySigner(privateKey);
        const hash = (opts.hash) ? opts.hash : await this.explorer.getBlockHead()
        const isRevealed = await this.explorer.isAddressRevealed(transaction.source)

        const contents = [];
        if(!isRevealed){
            const reveal = {
                kind: 'reveal',
                source: transaction.source,
                counter: String(transaction.counter),
                fee: CONSTANTS.OPERATIONS.REVEAL.FEES.DEFAULT,
                gas_limit: CONSTANTS.OPERATIONS.REVEAL.GAS_LIMIT.DEFAULT,
                storage_limit: 0,
                public_key: publicKey,
            }
            transaction.counter = String(parseInt(transaction.counter)+1);
            contents.push(reveal)
        }
        contents.push(transaction);
        const forgedHex = await LocalForger.localForger.forge({branch: hash, contents});
        const signed = await signer.sign(forgedHex, new Uint8Array([3]));
        return signed.sbytes;
    }
    async broadcastOperation(signedOperation){
        return this.rpc.injectOperation(signedOperation);
    }

    /**
     *
     * @param opts
     * @param opts.from
     * @param opts.to
     * @param opts.amount
     * @param [opts.counter]
     * @param [opts.fees]
     * @returns {Promise<{amount: string, gas_limit: {DEFAULT: number}, storage_limit: {DEFAULT: number}, kind: string, fee: string, destination, counter: string, source}>}
     */
    async buildTransaction(opts = {}){
        const {from, to, amount} = opts;
        const counter = (opts.counter !== undefined) ? opts.counter : (await this.explorer.getNonce(from)).result;
        const fees = (opts.fees !== undefined) ? opts.fees : this.explorer.getFee().normal;
        const transaction = {
            kind: 'transaction',
            counter: String(counter + 1),
            source: from,
            // Tez to Mutez
            fee: String(tezToMutez(fees)),
            gas_limit: CONSTANTS.TRANSACTIONS.GAS_LIMIT.DEFAULT.toString(),
            storage_limit: CONSTANTS.TRANSACTIONS.STORAGE_LIMIT.DEFAULT.toString(),
            destination: to,
            // Tez to Mutez
            amount: String(tezToMutez(amount)),
        };
        return transaction
    }
};
module.exports = Wallet;
