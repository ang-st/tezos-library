const BigNumber = require("bignumber.js");

module.exports = function decodeAmount(value, decimal){
    const bn = new BigNumber(value)
    return bn.div((10 ** decimal)).toNumber()
}
