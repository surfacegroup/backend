const User = require('../models/user')
const { errorHandler } = require('../helpers/dbErrorHandler')
const {Order} = require('../models/order')

exports.userByID = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        req.profile = user
        next();
    })
}

exports.read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

exports.update = (req, res) => {
    User.findOneAndUpdate({_id: req.profile._id}, {$set: req.body}, {new: true}, (err, user) => {
        if(err) {
            return res.status(400).json({
                error: "You are not authorized to perform this action"
            })
        }
        user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
    })
}

exports.addOrderToUserHistory = (req, res, next) => {
    let history =[]
    req.body.order.products.forEach((item) => {
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.count,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount
        })
    })
    User.findOneAndUpdate({_id: req.profile._id}, {$push: {history: history}}, {new: true}, (error, data) => {
        if(error) {
            return res.status(400).json({
                error: 'Could not update user purchase history'
            })
        }
        next()
    })
}

exports.purchaseHistory = (req, res) => {
    Order.find({user: req.profile._id})
    .populate('user', '_id name')
    .sort('-created')
    .exec((err, orders) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(orders)
    })
}

exports.updateAdminSubscribers = (req, res) => {
    let subscribersTempArr = []
    subscribersTempArr.push(req.body.email)
    
    User.updateMany({role: 1}, {$push: {subscribers: subscribersTempArr}}, {new: true}, (error, data) => {
        if(error) {
            return res.status(400).json({
                error: 'Could not add to mailing list'
            })
        }
        res.json(data)
    })

}


exports.getAdminSubscribers = (req, res) => {
     if(req.profile.role == 1) {
        return res.json(req.profile.subscribers)
     } else {
        return "You Are Not An Admin.."
     }
}


exports.addToWishlist = (req, res) => {
    let favorites = []
    favorites.push(req.body)
    console.log(req.body)
    User.findOneAndUpdate({_id: req.profile._id}, {$push: {wishlist: favorites}}, {new: true}, (error, data) => {
        if(error) {
            return res.status(400).json({
                error: 'Could not update user wishlist'
            })
        }
        res.json(data)
    })

    }


    exports.removeFromWishlist = (req, res) => {
        let usersWishlist = req.profile.wishlist
        let newArr = []
        usersWishlist.forEach((favorite) => {
            if(req.product._id == favorite._id) {
                newArr.push(favorite)
                User.findOneAndUpdate({_id: req.profile._id}, {$pullAll: {wishlist: newArr}}, {new: true}, (error, data) => {
                    if(error) {
                        return res.status(400).json({
                            error: 'Could not delete item from user wishlist'
                        })
                    }
                    res.json({
            message: "Removed from wishlist successfully"
        })
                })
            } else  {
                return null
            }
        })
        
    }

    exports.getUserWishlist = (req, res) => {
        return res.json(req.profile.wishlist)
    }

