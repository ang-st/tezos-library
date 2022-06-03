const { expect } = require('chai');
const TZ2Wallet = require('./TZ2Wallet');

describe('TZ2Wallet', function suite() {
    describe('TZ2Wallet - constructor', function (){
        it('should construct an instance', () => {
            const tz2Wallet = new TZ2Wallet();
            expect(tz2Wallet).to.exist;
        });
    });

});
