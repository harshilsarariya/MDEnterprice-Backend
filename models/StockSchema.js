const mongoose = require("mongoose");
const { Schema } = mongoose;

const StockSchema = new Schema({
  itemId: {
    type: String,
    require: true,
  },    
  quantity: {
    type: Number,
    default: 0,
  },
  amount: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Stock = mongoose.model("stock", StockSchema);
module.exports = Stock;
