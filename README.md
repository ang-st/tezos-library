## Tezos-Library

Open source Tezos library for EAZY F.A on Tezos.    
Provides wallet support for TZ1 and TZ2.  
Provide pricing and payment API support.  
Includes fetching of various information such as nonce, blockHead, Tezos, FA 1.2 & FA 2.0 balances.

## Install 

`npm i github:DIGITAL-EXCHANGE-FR/tezos-library`

## Wallet 

Will generate a new seed and mnemonic when initiated without any mnemonic or seed parameters. 
This mnemonic will only be exportable once (at first initialization) via the `.exportMnemonic` method.

```
const { Wallet } = require('tezos-library');
const wallet = new Wallet()
console.log(wallet.exportMnemonic())
```

## License

[MIT](/LICENSE) © Digital Exchange
