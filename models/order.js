const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const CartItemSchema = new mongoose.Schema({
    product: { type: ObjectId, ref: "Product" },
    SGname: String,
    vendorsName: String,
    vendor: String,
    seriesName: String,
    finishes: String,
    category: {type: ObjectId, ref: "Category"},
    sqFootPerBox: Number,
    VendorCostPerPiece: Number,
    VendorCostPerSF: Number,
    VendorCostPerBox: Number,
    SGPricePerPiece: Number,
    SGPricePerSF: Number,
    SGPricePerBox: Number,
    weight: Number,
    width: Number,
    length: Number,
    thickness: String,
    soldPerBox: Boolean,
    SGItemCode: String,
    VendorItemCode: String,
    count: Number
  },
  { timestamps: true }
)

const CartItem = mongoose.model("CartItem", CartItemSchema)

const OrderSchema = new mongoose.Schema({
    products: [CartItemSchema],
    transaction_id: {},
    amount: { type: Number },
    address: {type: String,
              required: true},
    status: {
      type: String,
      default: "Not processed",
      enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"] // enum means string objects
    },
    updated: Date,
    user: { type: ObjectId, ref: "User" }
  },
  { timestamps: true }
)

const Order = mongoose.model("Order", OrderSchema)

module.exports = { Order, CartItem };
