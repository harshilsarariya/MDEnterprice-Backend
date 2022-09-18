require("dotenv").config();
const express = require("express");
const connectToMongo = require("./db");
var cors = require("cors");
const itemRouter = require("./routes/itemRouter");
const partyRouter = require("./routes/partyRouter");
var bodyParser = require("body-parser");
connectToMongo();

const app = express();

// app.use(cors({ origin: "http://localhost:3000" }));

// create application/json parser
var jsonParser = bodyParser.json();

//Available routes
app.use("/api/party", jsonParser, partyRouter);
app.use("/api/item", jsonParser, itemRouter);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Port is listining on " + PORT);
});
