const {expect} = require('chai');
const Wallet = require('./Wallet');
const {sign} = require("tiny-secp256k1");

describe('Wallet', function suite() {
    let wallet;
    let tz1Wallet;
    let tz2Wallet;
    let soundErrorMnemonic = 'sound error pumpkin property error start evoke flavor glow modify zebra bronze'
    let soundErrorWalletTZ1;
    let soundErrorWalletTZ2;
    describe('Wallet - constructor', function () {

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
            expect(function () {
                soundErrorWalletTZ1.exportMnemonic();
            }).to.throw('soundErrorWalletTZ1.exportMnemonic is not a function');
            expect(function () {
                soundErrorWalletTZ2.exportMnemonic();
            }).to.throw('soundErrorWalletTZ2.exportMnemonic is not a function');
        });
    });
    describe('Wallet - derivePath', function () {
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
            expect(address).to.equal('tz2MpVn6hViurszSAhsAPv3sdFFwd6twwNf1')
            expect(privateKey).to.equal('spsk3LsZGKVLN4J2ECSZmoo9y1s7yuAjUU5V4Mk52wzRLQSFzyA9sN')
            expect(publicKey).to.equal('sppk7ZPwbNA7tjh1AUuMKiiNvLmQLBXcbevhZGGJgCDRHG286vhG34W')
        });
    })
    describe('Wallet - build transaction', function () {
        let transactiontz1;
        let transactiontz2;
        it('should build a transaction', async function () {
            const derivationTZ1 = await soundErrorWalletTZ1.derivePath(`m/1'`);

            transactiontz1 = await soundErrorWalletTZ1.buildTransaction({
                from: derivationTZ1.address,
                to: 'tz1RJGVHn37FPug18pALTjsZjUrRqSbuX8bG',
                amount: 1,
            });
            expect(transactiontz1.kind).to.equal('transaction');
            expect(parseInt(transactiontz1.counter)).to.be.greaterThan(65028274);
            expect(transactiontz1.source).to.equal('tz1MYPrADDc7XYazQKaVMAtfsJWb6kbLPSDt');
            expect(transactiontz1.fee).to.equal('1350');
            expect(transactiontz1.gas_limit).to.equal('10600');
            expect(transactiontz1.storage_limit).to.equal('496');
            expect(transactiontz1.destination).to.equal('tz1RJGVHn37FPug18pALTjsZjUrRqSbuX8bG');
            expect(transactiontz1.amount).to.equal('1000000');

            const derivationTZ2 = await soundErrorWalletTZ2.derivePath(`m/1`);

            transactiontz2 = await soundErrorWalletTZ2.buildTransaction({
                from: derivationTZ2.address,
                to: 'tz1RJGVHn37FPug18pALTjsZjUrRqSbuX8bG',
                amount: 1.234567,
            });
            expect(transactiontz2.kind).to.equal('transaction');
            expect(parseInt(transactiontz2.counter)).to.be.greaterThan(65028274);
            expect(transactiontz2.source).to.equal('tz29zPVZLj51ufwg7hTqvoMku314PevAkNHK');
            expect(transactiontz2.fee).to.equal('1350');
            expect(transactiontz2.gas_limit).to.equal('10600');
            expect(transactiontz2.storage_limit).to.equal('496');
            expect(transactiontz2.destination).to.equal('tz1RJGVHn37FPug18pALTjsZjUrRqSbuX8bG');
            expect(transactiontz2.amount).to.equal('1234567');
        });
        it('should sign a transaction', async function () {
            const derivationTZ1 = await soundErrorWalletTZ1.derivePath(`m/1'`);
            const derivationTZ2 = await soundErrorWalletTZ2.derivePath(`m/1`);

            // Required to have deterministic sig for our unit test.
            transactiontz1.counter = 65028274;
            const signedTxTZ1 = await soundErrorWalletTZ1.signTransaction(transactiontz1, {
                publicKey: derivationTZ1.publicKey,
                privateKey: derivationTZ1.privateKey,
                // Required to have deterministic sig for our unit test.
                hash: 'BLchfh6HRBjEYGuWUGytKAiyxhKmjczascntdUym8XyygBU6Tvv'
            });
            // Required to have deterministic sig for our unit test.
            expect(signedTxTZ1).to.equal('7706625a003abb94de0ebad8a65e09f9c0fcc24ccd7e41646a9b8355f3724a9c6b0014df6a73a81d67ea29020524ed106727596582c7f609b281811fcc0800007e3fbead82c1294ecc94616918fd0da188ff1e4f28fe016f45ae4e84b92d93c36c0014df6a73a81d67ea29020524ed106727596582c7c60ab381811fe852f003c0843d00003e13f3ab120fb5e538efb22a32d38787585909410090d847aad8d6c47e6cf272b6e0148ebc34bf46374c3cbea24ebb29c1c60ecf762e1a2249f147b4d6eb3126a159f053594e1e0ce1914d57c5a88aa7a7ee47220a')
            // Required to have deterministic sig for our unit test.
            transactiontz2.counter = 65028274;
            const signedTxTZ2 = await soundErrorWalletTZ1.signTransaction(transactiontz2, {
                publicKey: derivationTZ2.publicKey,
                privateKey: derivationTZ2.privateKey,
                // Required to have deterministic sig for our unit test.
                hash: 'BLchfh6HRBjEYGuWUGytKAiyxhKmjczascntdUym8XyygBU6Tvv'
            });
            expect(signedTxTZ2).to.equal('7706625a003abb94de0ebad8a65e09f9c0fcc24ccd7e41646a9b8355f3724a9c6b01125fb86b49662a1d739822c5a181b3807d439db6f609b281811fcc08000103e0e3b28fd4bf39991f875b14bf021549423a4905f73c7b55b97f53d4f5217be46c01125fb86b49662a1d739822c5a181b3807d439db6c60ab381811fe852f00387ad4b00003e13f3ab120fb5e538efb22a32d387875859094100fcce2ac130b8528b76a358ef8bcc5753be061a41421768547f6739e917c83f6a058bb9294697f605303c50389e7b9974c4b10c412d9366eb1d5e7a10f8bb29a1')
        });
    })
});
