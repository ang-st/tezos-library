const axios = require("axios");

class PaymentAPI {
    constructor() {
        this.client = axios.create({ baseURL: `https://api.tzstats.com/explorer` })
    }
};
module.exports = PaymentAPI;
