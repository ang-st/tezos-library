const { expect } = require('chai');
const Wallet = require('./Wallet');

describe('Wallet', function suite() {
    let wallet;
    let tz1Wallet;
    let tz2Wallet;
    let soundErrorMnemonic = 'sound error pumpkin property error start evoke flavor glow modify zebra bronze'
    let soundErrorWalletTZ1;
    let soundErrorWalletTZ2;
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
        it('should create a mnemonic if not provided', function () {
            const wallet = new Wallet();
            const mnemonic = wallet.exportMnemonic();
            expect(mnemonic.split(' ').length).to.equal(12)
        });
        it('should initiate from a mnemonic', function () {
            soundErrorWalletTZ1 = new Wallet({mnemonic: soundErrorMnemonic});
            soundErrorWalletTZ2 = new Wallet({mnemonic: soundErrorMnemonic, type: 'tz2'});
        });
        it('should not store mnemonic', function () {
            expect(function () { soundErrorWalletTZ1.exportMnemonic(); }).to.throw('soundErrorWalletTZ1.exportMnemonic is not a function');
            expect(function () { soundErrorWalletTZ2.exportMnemonic(); }).to.throw('soundErrorWalletTZ2.exportMnemonic is not a function');
        });
    });
    describe('Wallet - derivePath', function (){
        it('should derivate tz1', async function () {
            const {path, address, privateKey, publicKey} = await soundErrorWalletTZ1.derivePath(`m/0'`);
            expect(path).to.equal(`m/44'/1729'/0'/0'/0'`)
            expect(address).to.equal('tz1RJGVHn37FPug18pALTjsZjUrRqSbuX8bG')
            expect(privateKey).to.equal('edskRoVjDQ5kPfVANnHWUmn3oDgHkGrz26q5mSHEPaAeDTsowzT3okZmWwfv9UHZ8m7GtGLZFXx8ynnoZxAci55fV5JCqWhhEw')
            expect(publicKey).to.equal('edpkuR7VErWzQSjEYYo3hsDoxk2Ea2ARY3uzuDsFAoA2X2n5SUn94w')
        });
        it('should derivate tz2', async function () {
            const {path, address, privateKey, publicKey} = await soundErrorWalletTZ2.derivePath(`m/0`);
            expect(path).to.equal(`m/44'/1729'/0'/0'/0`)
            expect(address).to.equal('tz2RHWAPctnUcoTLqPKng2pGWwkNrHnZKS9R')
            expect(privateKey).to.equal('spsk3FcgNbart2FUMRVS8HPpKcrQJL5PXET6jp8GAVHDHGmehnSuRG')
            expect(publicKey).to.equal('sppk7bEAaeBoQKrkhZTjNUQAjh3B6MfRxmCTLd3g8YNEW2oeD52khcY')
        });
    })

});
