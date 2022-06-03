class Library {
    constructor() {
        this.api = new API();
        this.wallet = new Wallet();
    }
};
module.exports = {
    ExplorerAPI: require('./ExplorerAPI/ExplorerAPI'),
    PaymentAPI: require('./PaymentAPI/PaymentAPI'),
    PricerAPI: require('./PricerAPI/PricerAPI'),
    Wallet: require('./Wallet/Wallet'),
    Internals: {
        TZ1Wallet: require('./Wallet/TZ1Wallet/TZ1Wallet'),
        TZ2Wallet: require('./Wallet/TZ2Wallet/TZ2Wallet'),
    }
};
