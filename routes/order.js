const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userByID, addOrderToUserHistory } = require("../controllers/user");
const { create, listOrders, getStatusValues, orderByID, updateOrderStatus } = require("../controllers/order");
const {updateSoldQuantity} = require("../controllers/product")

router.post('/order/create/:userId', requireSignin, isAuth, addOrderToUserHistory, updateSoldQuantity, create)
router.get('/order/list/:userId', requireSignin, isAuth, isAdmin, listOrders)
router.get('/order/status-values/:userId', requireSignin, isAuth, isAdmin, getStatusValues)
router.put('/order/:orderId/status/:userId', requireSignin, isAuth, isAdmin, updateOrderStatus)

router.param('userId', userByID)
router.param('orderId', orderByID)
module.exports = router