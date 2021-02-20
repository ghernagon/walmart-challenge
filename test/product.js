const chai = require('chai')
const expect = chai.expect

const controller = require('../controllers/products.controller')

describe("controller findDuplicateCharacters()", () => {

    it("should return 5 repeated characters in the string 'Juego Red Dead Redemption II'", () => {
        let description = "Juego Red Dead Redemption II";
        expect(controller.findDuplicateCharacters(description).length).to.equal(5);
    });

});

describe("controller calculateDisccount()", () => {

    it("should return a disccount of 0 when description doesn't contain any repeated characters", () => {
        let description = "Muñeca lipo 30";
        expect(controller.calculateDisccount(description)).to.equal(0);
    });

    it("should return a disccount of 30 when description have 3 repeated characters", () => {
        let description = "Televisión 54''";
        expect(controller.calculateDisccount(description)).to.equal(30);
    });
    
    it("should return a disccount of 50 when description have more than 5 repeated characters", () => {
        let description = "Televisión 75 pulgadas 8k libre región, Timeplex";
        expect(controller.calculateDisccount(description)).to.equal(50);
    });

});

describe("controller formatCurrency()", () => {
   
    it("should format price from 18000 to $ 18.000", () => {
        let price = 18000;
        expect(controller.formatCurrency(price)).to.equal('$ 18.000');
    });
    
});

describe("controller calculateProductWithDisccount()", () => {
   
    it("should calculate price based on disccount", () => {
        let fullPrice = 18000;
        let disccount = 10;
        expect(controller.calculateProductWithDisccount(fullPrice, disccount)).to.equal('$ 16.200');
    });
    
});
