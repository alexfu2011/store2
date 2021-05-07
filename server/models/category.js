const Mongoose = require("mongoose");
const { Schema } = Mongoose;

module.exports = Mongoose.model("Category", Schema({
    name: String,
    _userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    active: {
        type: Number,
        default: 1
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }]
}));