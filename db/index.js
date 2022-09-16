const mongoose = require("mongoose");

// url for connect database
const mongoURI = process.env.MONGODB_URL;

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to Mongo Successfully");
  });
};

module.exports = connectToMongo;
