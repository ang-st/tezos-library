const { expect } = require('chai');
const Library = require('./index');

const Wallet = require('./Wallet/Wallet')
const ExplorerAPI = require('./ExplorerAPI/ExplorerAPI')
const PricerAPI = require('./PricerAPI/PricerAPI')
const PaymentAPI = require('./PaymentAPI/PaymentAPI')

const TZ1Wallet = require('./Wallet/TZ1Wallet/TZ1Wallet')
const TZ2Wallet = require('./Wallet/TZ2Wallet/TZ2Wallet')

describe('Library', function suite() {
        it('should export all expected classes and internals', () => {
            expect(Library.Wallet).to.equal(Wallet);
            expect(Library.ExplorerAPI).to.equal(ExplorerAPI);
            expect(Library.PricerAPI).to.equal(PricerAPI);
            expect(Library.PaymentAPI).to.equal(PaymentAPI);
            expect(Library.Internals).to.exist;
            expect(Library.Internals.TZ1Wallet).to.equal(TZ1Wallet);
            expect(Library.Internals.TZ2Wallet).to.equal(TZ2Wallet);
        });
});
