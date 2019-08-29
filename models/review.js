const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema 

const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        default: "",
        maxLength: 32
    },
    content: {
        type: String,
        trim: true,
        default: "",
        maxLength: 32
    },
    rating: {
        type: Number
    },
    reviewer: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: ObjectId,
        ref: 'Product',
        required: true
    },
    reviewerName: {
        type: String,
        ref: 'User'
    }
}, 
{timestamps: true}
)

module.exports =  mongoose.model("Review", reviewSchema);

