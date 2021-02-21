const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const expect = chai.expect;
chai.use(sinonChai);
const controller = require('../controllers/products.controller');
const ProductModel = require('../models/products.model');
const { mockRequest, mockResponse } = require('mock-req-res');

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

describe('Product List', () => {

    afterEach(() => {
        sinon.reset();
        sinon.restore();
    });

    it('should return a results partial page if id 25 is provided', async() => {
        const req = { body: { term: "25" }};
        const res = mockResponse();
        const productMock = {
            "id": 1,
            "brand": "Marca1",
            "description": "Televisión 54''",
            "image": "www.lider.cl/catalogo/images/catalogo_no_photo.jpg",
            "price": 80000
        }

        sinon.stub(ProductModel, 'findOne').returns({
            lean: sinon.stub().resolves(productMock)
        });

        await controller.getProducts(req, res);
        sinon.assert.calledWith(ProductModel.findOne, { id: '25' });
        sinon.assert.calledWith(res.render, './partials/result' );
    });

    it('should return results if term is not provided', async() => {
        const req = { body: { term: "" }};
        const res = mockResponse();
        const productMock = [
            {
                "id": 40,
                "brand": "Marca Acme",
                "description": "Muñeca lipo 30",
                "image": "www.lider.cl/catalogo/images/catalogo_no_photo.jpg",
                "price": 18000
            }
        ];

        sinon.stub(ProductModel, 'find').returns({
            lean: sinon.stub().resolves(productMock)
        });
        sinon.stub(controller, 'findProducts').returns(productMock);

        await controller.getProducts(req, res);
        sinon.assert.calledOnce(ProductModel.find);
    });

    it('should return results if term is provided', async() => {
        const req = { body: { term: "Acme" }};
        const res = mockResponse();
        const productMock = [
            {
                "id": 40,
                "brand": "Marca Acme",
                "description": "Muñeca lipo 30",
                "image": "www.lider.cl/catalogo/images/catalogo_no_photo.jpg",
                "price": 18000
            }
        ];

        sinon.stub(ProductModel, 'find').returns({
            lean: sinon.stub().resolves(productMock)
        });
        sinon.stub(controller, 'findProducts').returns(productMock);

        await controller.getProducts(req, res);
        sinon.assert.calledOnce(ProductModel.find);
    });

    it('should return a no-results partial page if id 88 is provided', async() => {
        const req = { body: { term: "88" }};
        const res = mockResponse();

        sinon.stub(ProductModel, 'findOne').returns({
            lean: sinon.stub().resolves(null)
        });
        sinon.stub(ProductModel, 'find').returns({
            lean: sinon.stub().resolves([])
        });

        // sinon.stub(res, 'render').resolves(responseMock);

        // sinon.mock(ProductModel).expects('findOne').chain('lean').resolves(productMock);
        //   const response = await controller.getProducts();
        //   let res = await chai
        //         .request(app)
        //         .post('/search')
        //         .send({ term: "25" })

        await controller.getProducts(req, res);
        sinon.assert.calledWith(ProductModel.findOne, { id: '88' });
        sinon.assert.calledWith(ProductModel.find, { '$or': [ { brand: /88/i }, { description: /88/i } ] });
        sinon.assert.calledWith(res.render, './partials/no-results' );
    });
  });

