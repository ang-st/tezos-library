//https://github.com/Cryptonomic/ConseilJS/blob/master/src/types/tezos/TezosConstants.ts
const CONSTANTS = {
    OPERATIONS: {
        REVEAL:{
            FEES: {
                DEFAULT: 1270
            },
            STORAGE_LIMIT: {
                DEFAULT: 0
            },
            GAS_LIMIT: {
                DEFAULT: 1100
            }
        }
    },
    TRANSACTIONS: {
        FEES: {
            DEFAULT: 1420
        },
        STORAGE_LIMIT: {
            DEFAULT: 496
        },
        GAS_LIMIT: {
            DEFAULT: 10600
        }
    },
    DELEGATIONS: {
        FEES: {
            DEFAULT: 1258
        },
        STORAGE_LIMIT: {
            DEFAULT: 0
        },
        GAS_LIMIT: {
            DEFAULT: 1100
        }
    }
};
module.exports = CONSTANTS
