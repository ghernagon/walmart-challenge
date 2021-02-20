const chai = require('chai')
const expect = chai.expect

const controller = require('../controllers/products.controller')

describe("controller findDuplicateCharacters()", () => {

    it("should return 5 repeated characters in the string 'Juego Red Dead Redemption II'", () => {
        let description = "Juego Red Dead Redemption II";
        expect(controller.findDuplicateCharacters(description)).to.have.lengthOf(5);
    });

    it("should throw an error if description is not a string", () => {
        expect(() => controller.findDuplicateCharacters(50)).to.throw(Error, 'description must be a string');
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

    it("should throw an error if description is not a string", () => {
        expect(() => controller.calculateDisccount(null)).to.throw(Error, 'description must be a string');
    });

});

describe("controller formatCurrency()", () => {
   
    it("should format price from 18000 to $ 18.000", () => {
        let price = 18000;
        expect(price).to.be.a('number');
        expect(controller.formatCurrency(price)).to.equal('$ 18.000');
    });

    it("should throw an error if price is not a number", () => {
        expect(() => controller.formatCurrency("price")).to.throw(Error, 'price must be a number');
    });
    
});

describe("controller calculateProductWithDisccount()", () => {
   
    it("should calculate price based on disccount", () => {
        let fullPrice = 18000;
        let disccount = 10;
        expect(controller.calculateProductWithDisccount(fullPrice, disccount)).to.equal('$ 16.200');
    });

    it("should throw an error if price is not a number", () => {
        expect(() => controller.calculateProductWithDisccount("price", 50)).to.throw(Error, 'price must be a number');
    });

    it("should throw an error if disccount is not a number", () => {
        expect(() => controller.calculateProductWithDisccount(8000, "disccount")).to.throw(Error, 'disccount must be a number');
    });
    
});
