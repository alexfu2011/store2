const Mongoose = require("mongoose");
const { Schema } = Mongoose;
const Review = require("./review");

module.exports = Mongoose.model("Product", Schema({
    _userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    name: String,
    brandName: String,
    stock: Number,
    price: Number,
    tax: {
        type: Number,
        default: 0
    },
    shipping: {
        type: Number,
        default: 0
    },
    summary: String,
    description: String,
    image: String,
    isActive: {
        type: Number,
        default: 1
    },
    timeStamp: {
        type: Number,
        default: Date.now()
    }
}));
