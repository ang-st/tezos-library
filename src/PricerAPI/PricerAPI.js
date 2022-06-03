const axios = require("axios");

class PricerAPI {
    constructor() {
        this.client = axios.create({ baseURL: `https://api.tzstats.com/explorer` })

    }
};
module.exports = PricerAPI;
