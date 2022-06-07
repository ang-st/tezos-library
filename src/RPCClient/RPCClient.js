const axios = require('axios')
class RPCClient {
    constructor(){
        this.client = axios.create({ baseURL: `https://mainnet-tezos.giganode.io/` })
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
