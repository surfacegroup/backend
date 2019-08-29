const {Order} = require('../models/order')
const User = require('../models/user')
const { errorHandler } = require('../helpers/dbErrorHandler')
const sgMail = require('@sendgrid/mail')
require("dotenv").config()
sgMail.setApiKey(process.env.SENDGRID_KEY)



exports.orderByID = (req, res, next, id) => {
    Order.findById(id)
    .populate('products.product', 'name price')
    .exec((err, order) => {
        if(err || !order) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        req.order = order
        next()
    })
}

exports.create = (req, res) => {
    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    order.save((error, data) => {
        if(error) {
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
    
        const adminData = {
            to: 'surfacegroupint@gmail.com',
            from: 'orders@surfacegroup.com',
            subject: `A new order is received`,
            html: `
            <p>Customer name:</p>
            <p>Total products: ${order.products.length}</p>
            <p>Total cost: ${order.amount}</p>
            <p>Login to dashboard to view the order in detail.</p>
        `
        };
        sgMail.send(adminData);

        const clientData = {
            to: `${order.user.email}`,
            from: 'orders@surfacegroup.com',
            subject: `We received your order`,
            html: `
            <p>Customer name: ${order.user.name}</p>
            <p>Total products: ${order.products.length}</p>
            <p>Total cost: ${order.amount}</p>
            <p>Login to dashboard to view the order in detail.</p>
        `
        };
        sgMail.send(clientData);


    
        res.json(data)
        console.log(data)
    })
    
}

exports.listOrders = (req, res) => {
    Order.find()
    .populate('user', '_id name address')
    .sort('-created')
    .exec((err, orders) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
        res.json(orders)
    })
}

exports.getStatusValues = (req, res) => {
    res.json(Order.schema.path('status').enumValues)
}

exports.updateOrderStatus = (req, res) => {
    Order.update({_id: req.body.orderId}, {$set: {status: req.body.status}}, (err, order) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
    
        User.findById(req.order.user)
        .exec((err, user) => {
            if(err || !user) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            
            const emailData = {
                to: `${user.email}`,
                from: 'orders@surfacegroup.com',
                subject: `Your Order Has Been Updated`,
                html: `
                <p>Customer name: ${user.name}</p>
                <p>Order Status: ${req.body.status}</p>
                <p>Total products: ${req.order.products.length}</p>
                <p>Total cost: ${req.order.amount}</p>
                <p>Login to dashboard to view the order in detail.</p>
            `
            };
            sgMail.send(emailData);
          
        })
        
    
        
        res.json(order)
        // console.log(req.order.user)
    })
}