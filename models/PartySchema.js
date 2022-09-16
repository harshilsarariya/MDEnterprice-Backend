const mongoose = require("mongoose");
const { Schema } = mongoose;

const PartySchema = new Schema({
  partyName: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Party = mongoose.model("Party", PartySchema);
module.exports = Party;
