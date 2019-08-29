let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
const expect = chai.expect;
const Product = require('../models/product')

chai.use(chaiHttp);
chai.should();
describe("Products", () => {

    describe("GET /api/products", () => {
        // get all products
        it("should get all products", (done) => {
            chai.request(app)
                 .get('/api/products')
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('array');
                     res.body.forEach((item) => {
                         item.should.be.a('object')
                     })
                     done();
            })
        })
    })

    describe("GET /api/product/:id", () => {
        // get a single product
        it("should get single product", (done) => {
            let id = "5d3f2a189330283e54b41a66"
            chai.request(app)
                .get(`/api/product/${id}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    done()
                })
        })

        // NOT get a single product 
        it("should return 400 if product id doesnt exist", (done) => {
            const id = "12";
            chai.request(app)
                .get(`/api/product/${id}`)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    // describe("POST /api/product/create", (done) => {
        
    // })
});