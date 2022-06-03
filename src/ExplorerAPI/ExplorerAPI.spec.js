const { expect } = require('chai');
const ExplorerAPI = require('./ExplorerAPI');

describe('ExplorerAPI', function suite() {
    const explorerAPI = new ExplorerAPI();
    describe('ExplorerAPI - constructor', function (){
        it('should construct an instance', () => {
            expect(explorerAPI).to.exist;
        });
        it('should have two axios client', function () {
            expect(explorerAPI.client).to.exist;
            expect(explorerAPI.client.defaults.baseURL).to.equal('https://api.tzstats.com/explorer');
            expect(explorerAPI.alternativeClient).to.exist
            expect(explorerAPI.alternativeClient.defaults.baseURL).to.equal('https://api.tzkt.io/v1/');
        });
    });
});
