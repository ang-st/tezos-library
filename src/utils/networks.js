let networks = {
  conf:{
    mainnet:{ base:'https://api.tzstats.com/explorer', alt:"https://api.tzkt.io/v1/", rpc:'https://mainnet-tezos.giganode.io/'},
    ghostnet:{base:'https://api.ghost.tzstats.com', alt:'https://ghostnet.tzkt.io/'},
    jakartanet:{base:' https://api.jakarta.tzstats.com', alt:"https://jakartanet.tzkt.io/", rpc:'https://testnet-tezos.giganode.io/'}
  }
}
networks.list= Object.keys(networks.conf)
module.exports=networks
