let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
const expect = chai.expect
chai.use(chaiHttp);
chai.should();

describe("Categories", () => {

    // get all categories
    describe("GET /api/categories", () => {
        it("should get all categories", (done) => {
             chai.request(app)
                 .get('/api/categories')
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('array');
                     res.body.forEach((item) => {
                         item.should.be.a('object')
                     })
                     done();
                    });
        });
    });

     // get a single category
    describe("GET /api/category/:id", (done) => {
        it("should get single category", (done) => {
            let id = "5d23590a843a792c9202f92a"
            chai.request(app)
                .get(`/api/category/${id}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    done()
                })
        })
        it("should return 400 if category id doesnt exist", (done) => {
            const id = "12";
            chai.request(app)
                .get(`/api/category/${id}`)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    

});