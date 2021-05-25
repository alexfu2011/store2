const Mongoose = require('mongoose');
const { Schema } = Mongoose;

const DiscountSchema = new Schema({
  code: String,
  percentage: String,
  quantity: Number,
  from: Date,
  to: Date,
  name: String,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('Discount', DiscountSchema);
