const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemSchema = new Schema({
  itemName: {
    type: String,
    trim: true,
    require: true,
  },
  sellingPrice: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;
