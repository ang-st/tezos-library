const { expect } = require('chai');
const TZ1Wallet = require('./TZ1Wallet');

describe('TZ1Wallet', function suite() {
    describe('TZ1Wallet - constructor', function (){
        it('should construct an instance', () => {
            const tz1Wallet = new TZ1Wallet();
            expect(tz1Wallet).to.exist;
        });
    });

});
