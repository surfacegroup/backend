const express = require('express');
const router = express.Router();
const { requireSignin, isAuth } = require("../controllers/auth");
const { userByID } = require("../controllers/user");
const { productByID } = require("../controllers/product");
const { reviewByID, remove, listReviews, create } = require("../controllers/review");

router.post('/review/create/:userId', requireSignin, isAuth, create);
router.get('/reviews/:productId', listReviews)
router.delete('/review/:reviewId/:userId', requireSignin, isAuth, remove)

router.param("productId", productByID)
router.param("reviewId", reviewByID)
router.param("userId", userByID)
module.exports = router;