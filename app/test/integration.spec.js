const chai = require('chai');
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
const should = chai.should();
const app = require('../app');

describe("integration test", () => {

    it("should return status 404 for non existing route", done => {
        chai
            .request(app)
            .get('/search123')
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });

    it("should return status 200", done => {
        chai
            .request(app)
            .post('/search')
            .send({ term: "25" })
            .end((err, res) => {
                res.should.have.status(200);
                done()
            });
    });

    it("should return a product from db if id 25 is specified", done => {
        const expectedResult = [{ "id": 25, "brand": "Marca9", "description": "Pack toallas mano Bambu-Menta", "image": "www.lider.cl/catalogo/images/catalogo_no_photo.jpg", "price": 5000, "disccount": 50, "fullPrice": "$ 5.000", "offerPrice": "$ 2.500" }];

        chai
            .request(app)
            .post('/search')
            .send({ term: "25" })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.data).to.have.lengthOf(1);
                expect(res.body.data).to.deep.equal(expectedResult);
                done();
            });
    });

    it("should return an array of products from db if term is specified", done => {
        const expectedResult = [
            { "id": 28, "brand": "Marca10", "description": "Licuadora Expert Red", "image": "www.lider.cl/catalogo/images/catalogo_no_photo.jpg", "price": 80000, "disccount": 40, "fullPrice": "$ 80.000", "offerPrice": "$ 48.000" },
            { "id": 29, "brand": "Marca10", "description": "Cama King Size Europea", "image": "www.lider.cl/catalogo/images/catalogo_no_photo.jpg", "price": 140000, "disccount": 30, "fullPrice": "$ 140.000", "offerPrice": "$ 98.000" }
        ];

        chai
            .request(app)
            .post('/search')
            .send({ term: "marca+10" })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.data).to.have.lengthOf(2);
                expect(res.body.data).to.deep.equal(expectedResult);
                done();
            });
    });

});