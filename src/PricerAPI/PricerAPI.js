const axios = require("axios");

class PricerAPI {
    constructor() {
        this.client = axios.create({ baseURL: `https://api.zebitex.com/` })
    }
    async getTicker(){
        return this.client.get('/api/v1/orders/tickers');
    }
};
module.exports = PricerAPI;
