const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userByID, read, update, purchaseHistory, addToWishlist, removeFromWishlist, getUserWishlist, updateAdminSubscribers, getAdminSubscribers } = require("../controllers/user");
const { productByID } = require("../controllers/product");

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    })
})
router.get('/user/:userId', requireSignin, isAuth, read)
router.put('/user/:userId', requireSignin, isAuth, update)
router.put('/user/subscribers/update', updateAdminSubscribers)
router.get('/user/subscribers/:userId', requireSignin, isAuth, isAdmin, getAdminSubscribers)
router.put('/user/updatewishlist/:userId', requireSignin, isAuth, addToWishlist)
router.delete('/user/updatewishlist/:productId/:userId', requireSignin, isAuth, removeFromWishlist)
router.get('/user/wishlist/:userId', requireSignin, isAuth, getUserWishlist)
router.get('/orders/by/user/:userId', requireSignin, isAuth, purchaseHistory)

router.param('userId', userByID);
router.param('productId', productByID);
module.exports = router;