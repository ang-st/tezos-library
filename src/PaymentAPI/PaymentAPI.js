const axios = require("axios");
const networks = require('../utils/networks')

class PaymentAPI {
    constructor(network) {
        this.client = axios.create({ baseURL: networks.conf[network] })
    }
};
module.exports = PaymentAPI;
