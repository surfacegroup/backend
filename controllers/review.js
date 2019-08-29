const Review = require('../models/review')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.create = (req, res) => {
    const review = new Review(req.body)
    review.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({ data })
    })
}
exports.listReviews = (req, res) => {
    Review.find({product: req.product._id})
    .populate('product', '_id')
    .sort('-created')
    .exec((err, reviews) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(reviews)
    })
}

// exports.listReviews = (req, res) => {
//     let order = req.query.order ? req.query.order : 'asc'
//     let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
//     let limit = req.query.limit ? parseInt(req.query.limit) : 6

//     Review.find()
//         .sort([[sortBy, order]])
//         .limit(limit)
//         .exec((err, reviews) => {
//             if(err) {
//                 return res.status(400).json({
//                     error: 'Reviews not found'
//                 })
//             }
//             res.json(reviews)
//         })

// }

exports.remove = (req, res) => {
    let review = req.review;
    review.remove((err, deletedReview) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Review deleted successfully"
        });
    });
}

exports.reviewByID = (req, res, next, id) => {
    Review.findById(id).exec((err, review) => {
        if(err || !review) {
            return res.status(400).json({
                error: 'Review not found'
            })
        }
        req.review = review
        next()
    })
}