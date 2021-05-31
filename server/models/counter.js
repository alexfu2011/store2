const Mongoose = require("mongoose");
const { Schema } = Mongoose;

const CounterSchema = Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

module.exports = Mongoose.model('Counter', CounterSchema);
