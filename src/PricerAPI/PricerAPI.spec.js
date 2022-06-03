const { expect } = require('chai');
const PricerAPI = require('./PricerAPI');

describe('PricerAPI', function suite() {
    const pricerAPI = new PricerAPI();
    describe('PricerAPI - constructor', function (){
        it('should construct an instance', () => {
            expect(pricerAPI).to.exist;
        });
        it('should have an axios client', function () {
            expect(pricerAPI.client).to.exist;
            expect(pricerAPI.client.defaults.baseURL).to.equal('https://api.zebitex.com/');
        });
    });
});
