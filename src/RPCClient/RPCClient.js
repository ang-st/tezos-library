const axios = require('axios')
const networks = require('../utils/networks')

class RPCClient {
    constructor(network){
        this.client = axios.create({ baseURL: networks.conf[network].rpc })
    }
    injectOperation(operation){
        const data = JSON.stringify(operation);
        this.client.post('/injection/operation', data, {
            headers: {
                "Cache-Control":  "no-cache",
                "Content-Type": "application/json",
            }
        });

    }
}
module.exports = RPCClient;
