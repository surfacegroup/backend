const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema 

const productSchema = new mongoose.Schema({
    SGname: {
        type: String,
        trim: true,
        required: true,
        maxLength: 32
    },
    vendorsName: {
        type: String,
        trim: true,
        maxLength: 32
    },
    vendor: {
        type: String,
        trim: true,
        maxLength: 32
    },
    seriesName: {
        type: String,
        trim: true,
        maxLength: 32
    },
    color: {
        type: String,
        trim: true,
        maxLength: 32
    },
    colorVariation: {
        type: String,
        trim: true,
        maxlength: 32
    },
    textureVariation: {
        type: String,
        trim: true,
        maxlength: 32
    },
    minimumOrder: {
        type: Number,
        default: 2
    },
    application: {
        type: String,
        trim: true,
        maxLength: 64
    },
    finishes: {
        type: String,
        trim: true,
        maxlength: 64
    },
    stockSizes: {
        type: String,
        trim: true,
        maxlength: 64
    },
    origin: {
        type: String,
        trim: true,
        maxlength: 64
    },
    residentialUse: {
        type: Boolean,
        default: false
    },
    commercialUse: {
        type: Boolean,
        default: false
    },
    outdoorUse: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        trim: true,
        maxlength: 2000
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        required: true
    },
    style: {
        type: String,
        trim: true,
        maxlength: 32
    },
    picture: {
        data: Buffer,
        contentType: String
    },
    sold: {
        type: Number,
        default: 0
    },
    sqFootPerBox: {
        type: Number,
        default: 0
    },
    SGPricePerPiece: {
        type: Number,
        default: 0
    },
    SGPricePerSF: {
        type: Number,
        default: 0
    },
    SGPricePerBox: {
        type: Number,
        default: 0
    },
    VendorCostPerPiece: {
        type: Number,
        default: 0
    },
    VendorCostPerSF: {
        type: Number,
        default: 0
    },
    VendorCostPerBox: {
        type: Number,
        default: 0
    },
    weight: {
        type: Number,
        default: 0
    },
    length: {
        type: Number,
        default: 0
    },
    width: {
        type: Number,
        default: 0
    },
    thickness: {
        type: String,
        trim: true,
        maxlength: 32
    },
    soldPerBox: {
        type: Boolean,
        required: true,
        default: false
    },
    SGItemCode: {
        type: String
    },
    VendorItemCode: {
        type: String
    },
    Quantity: {
        type: Number
    },
    Special: {
        type: Boolean,
        default: false
    }
}, 
{timestamps: true}
);

module.exports =  mongoose.model("Product", productSchema);

