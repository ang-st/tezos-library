const { expect } = require('chai');
const Wallet = require('./Wallet');

describe('Wallet', function suite() {
    let wallet;
    let tz1Wallet;
    let tz2Wallet;
    describe('Wallet - constructor', function (){
        it('should construct an instance', () => {
            const wallet = new Wallet();
            expect(wallet).to.exist;
            expect(wallet.type).to.equal('tz1');
        });
        it('should construct an instance of different type', function () {
            const tz1Wallet = new Wallet({type: 'tz1'});
            expect(tz1Wallet).to.exist;
            expect(tz1Wallet.type).to.equal('tz1');
            const tz2Wallet = new Wallet({type: 'tz2'});
            expect(tz2Wallet).to.exist;
            expect(tz2Wallet.type).to.equal('tz2');
        });
    });

});
