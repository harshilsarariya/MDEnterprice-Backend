const mongoose = require("mongoose");
const { Schema } = mongoose;

const PartyOrderSchema = new Schema({
  partyId: {
    type: String,
    require: true,
  },
  itemName: {
    type: String,
    trim: true,
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

const PartyOrder = mongoose.model("partyOrder", PartyOrderSchema);
module.exports = PartyOrder;
