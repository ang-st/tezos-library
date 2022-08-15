const axios = require('axios');
const decodeAmount = require('../utils/decodeAmount');
const networks = require('../utils/networks')

class ExplorerAPI {
    constructor(opts = {}) {
        if (!networks.list).includes(opts.network){
            this.client = axios.create({ baseURL: networks.conf[opts.networks].base })
            // Used as replacement for first explorer when fetching counter.
            this.alternativeClient = axios.create({ baseURL: networks.conf[opts.networks].alt })
        } else {
            this.client = axios.create({ baseURL: networks.mainnet.base })
            this.alternativeClient = axios.create({ baseURL: networks.mainnet.alt })
        }
    }

    getBlockHead(){
        return this.client.get('/block/head')
            .then((res)=> {
                return res.data.hash;
            });
    }
    getFee(){
        // Most bakers are using the default value, this allows us to use a constant to answer the gas estimation
        // for a transaction.
        // See: https://tezosguides.com/wallet_integration/basics/fee_schedule/
        return {
            slow: 0.001350,
            normal: 0.001350,
            fast: 0.001350
        }
    }
    async isAddressRevealed(address){
            return this.client.get(`/account/${address}`)
                .then(response => {
                    return response.data.is_revealed
                }).catch(()=>{
                    return false;
                })
    }
    async getContractMetadata(contractAddress){
        return await this.client.get(`/account/${contractAddress}?meta=1`)
    }

    async getBalance(address, contractAddress){
        if(!contractAddress){
            return this.client.get(`/account/${address}`)
                .then(response => {
                    return { result: response.data.spendable_balance || 0 }
                })
        }
        const getContractResponse = await this.client.get(`/contract/${contractAddress}`)

        const getContractMetadata = await this.getContractMetadata(contractAddress);
        const {decimals} = getContractMetadata.data.metadata[contractAddress].asset;

        if (!getContractResponse.data || !getContractResponse.data.bigmaps) {
            return new Error(`Unable to find ledger information for contract ${contractAddress}`)
        }

        const balanceBigMapKeys = ['ledger', 'balances']
        const balanceBigMapKeyName = Object
            .keys(getContractResponse.data.bigmaps)
            .filter((k) => balanceBigMapKeys.includes(k))
            .shift()

        if (!balanceBigMapKeyName) {
            throw new Error(`Unable to find ledger information for contract ${contractAddress}`)
        }

        const ledgerBigMapId = getContractResponse.data.bigmaps[balanceBigMapKeyName]
        const ledgerResponse = await this.client.get(`/bigmap/${ledgerBigMapId}/values`)
        const filteredLedger = ledgerResponse.data.filter((e) => e.key['0'] === address)
        // What if there is .balance ?
        const balance = filteredLedger.length === 0 ? 0 : filteredLedger[0].value;
        return { result: decodeAmount(balance, decimals) }

    }
    getNonce(address){
        return this.alternativeClient.get(`/accounts/${address}/counter`)
            .then(response => {
                return { result: response.data || 0 }
            });
    }
};
module.exports = ExplorerAPI;
