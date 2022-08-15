const axios = require('axios')
const networks = require('../utils/networks')

class RPCClient {
    constructor(network){
        this.client = axios.create({ baseURL: networks.conf[network].rpc })
    }
    async injectOperation(operation){
        const data = JSON.stringify(operation);
        this.client.post('/injection/operation', data, {
            headers: {
                "Cache-Control":  "no-cache",
                "Content-Type": "application/octet-stream",
            }
        });

    }
}
module.exports = RPCClient;
