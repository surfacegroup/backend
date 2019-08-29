const Product = require('../models/product')
const Review = require('../models/review')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.productByID = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if(err || !product) {
            return res.status(400).json({
                error: 'Product not found'
            })
        }
        req.product = product
        next()
    })
}

exports.read = (req, res) => {
    req.product.picture = undefined
    return res.json(req.product)
}

exports.create = (req, res) => {
    let form  = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }
        const {SGname, category} = fields
        if(!SGname|| !category) {
            return res.status(400).json({
                error: 'Product should atleast have a name and category'
            })
        }
        let product = new Product(fields)
        if(files.picture) {
            if(files.picture.size > 1000000) {
                return res.status(400).json({
                    error: "Image is too large, should be less than 1mb"
                })
            }
            product.picture.data = fs.readFileSync(files.picture.path)
            product.picture.contentType = files.picture.type
        }
        product.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    err: errorHandler(err)
                })
            }
            res.json(result)
        })
    })
}

exports.update = (req, res) => {
    let form  = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }
        let product = req.product
        product = _.extend(product, fields)
        if(files.picture) {
            if(files.picture.size > 1000000) {
                return res.status(400).json({
                    error: "Image is too large, should be less than 1mb"
                })
            }
            product.picture.data = fs.readFileSync(files.picture.path)
            product.picture.contentType = files.picture.type
        }
        product.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    err: errorHandler(err)
                })
            }
            res.json(result)
        })
    })
}

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    Product.find()
        .select("-picture")
        .populate("category")
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if(err) {
                return res.status(400).json({
                    error: 'Products not found'
                })
            }
            res.json(products)
        })
}

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find({_id: {$ne: req.product}, category: req.product.category})
    .limit(limit)
    .populate('category', '_id name')
    .exec((err, products) => {
        if(err) {
            return res.status(400).json({
                error: 'Products not found'
            })
        }
        res.json(products)
    })
}

exports.listCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if(err) {
            return res.status(400).json({
                error: "Categories not found"
            })
        }
        res.json(categories)
    })
}



exports.remove = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Product deleted successfully"
        });
    });
}

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc"
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id"
    let limit = req.body.limit ? parseInt(req.body.limit) : 100
    let skip = parseInt(req.body.skip)
    let findArgs = {}

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        })
}

exports.picture = (req, res, next) => {
    if(req.product.picture.data) {
        res.set("Content-Type", req.product.picture.contentType)
        return res.send(req.product.picture.data)
    }
    next()
}

exports.listSearch = (req, res) => {
    const query = {}
    if(req.query.search) {
        query.SGname = {$regex: req.query.search, $options: 'i'}
        if(req.query.category && req.query.category != 'All') {
            query.category = req.query.category
        }
        Product.find(query, (err, products) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(products)
        }).select('-photo')
    }
}

exports.updateSoldQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map((item) => {
        return {
            updateOne: {
                filter: {_id: item._id},
                update: {$inc: {Quantity: -item.count, sold: +item.count}}
            }
        }
    })
    Product.bulkWrite(bulkOps, {}, (error, products) => {
            if(error) {
                return res.status(400).json({
                    error: 'Could not update product'
                })
            }
            next();
    })
}