const express = require("express");
const router = express.Router();
const Party = require("../models/PartySchema");
const PartyOrder = require("../models/PartyOrderSchema");
const { body, validationResult } = require("express-validator");
const { isValidObjectId } = require("mongoose");

// ** Party Section ** //

// Add party using : POST "/api/party/addParty"
router.post(
  "/addParty",
  [
    body("partyName", "Enter a valid Party Name ").isLength({
      min: 3,
    }),
    body("mobileNo", "Enter a valid Mobile Number").isLength({ min: 9 }),
  ],
  async (req, res) => {
    let success = false;
    try {
      const { partyName, mobileNo } = req.body;
      // If there are error then return the bad request and error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const newParty = new Party({ partyName, mobileNo });

      const saveParty = await newParty.save();
      success = true;
      res.json({ success, saveParty });
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }
);

// Delete party using : DELETE "/api/party/deleteParty/id"
router.delete("/deleteParty/:id", async (req, res) => {
  const partyId = req.params.id;
  if (!isValidObjectId(partyId))
    return res.status(401).json({ error: "Invalid Request" });

  const party = await Party.findById(partyId);
  if (!party) return res.status(401).json({ error: "Party not found!" });

  await Party.findByIdAndDelete(partyId);
  res.json({ message: "Party removed successfully!" });
});

// Update party using : PUT "/api/party/updateParty/id"
router.put(
  "/updateParty/:id",
  [
    body("partyName", "Enter a valid Party Name ").isLength({
      min: 3,
    }),
    body("mobileNo", "Enter a valid Mobile Number").isLength({ min: 9 }),
  ],
  async (req, res) => {
    const { partyName, mobileNo } = req.body;
    const partyId = req.params.id;
    if (!isValidObjectId(partyId))
      return res.status(401).json({ error: "Invalid Request" });

    const party = await Party.findById(partyId);
    if (!party) return res.status(401).json({ error: "Party not found!" });

    party.partyName = partyName;
    party.mobileNo = mobileNo;

    await party.save();

    res.json({
      party: {
        id: party._id,
        partyName,
        mobileNo,
      },
    });
  }
);

// Fetch Party Info using : GET "/api/party/getPartyInfo/id"
router.get("/getPartyInfo/:id", async (req, res) => {
  const partyId = req.params.id;
  if (!isValidObjectId(partyId))
    return res.status(401).json({ error: "Invalid Request" });

  const party = await Party.findById(partyId);
  if (!party) return res.status(401).json({ error: "Party not found!" });

  const { partyName, mobileNo, date } = party;
  res.json({
    party: {
      id: party._id,
      partyName,
      mobileNo,
      date,
    },
  });
});

// Fetch Parties Info using : GET "/api/party/getAllParties"
router.get("/getAllParties", async (req, res) => {
  try {
    const parties = await Party.find().sort({ createdAt: -1 });
    res.json(parties);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Search Party Name : GET "/api/party/searchPartyByName"
router.get("/searchPartyByName", async (req, res) => {
  try {
    const { partyName } = req.query;
    let party = await Party.find({
      $and: [{ partyName: { $regex: partyName, $options: "m" } }],
    }).sort({
      createdAt: -1,
    });
    if (!party) {
      return res.status(404).send("Party Name Not Found!");
    }
    res.json(party);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ** Party Order Section ** //

// Add party Order using : POST "/api/party/addPartyOrder"
router.post(
  "/addPartyOrder",
  [
    body("itemName", "Enter a valid Item Name").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    let success = false;
    try {
      const { partyId, itemName, quantity, amount } = req.body;

      // If there are error then return the bad request and error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const newPartyOrder = new PartyOrder({
        partyId,
        itemName,
        quantity,
        amount,
      });

      const savePartyOrder = await newPartyOrder.save();
      success = true;
      res.json({ success, savePartyOrder });
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }
);

// Delete party Order using : DELETE "/api/party/deletePartyOrder"
router.delete("/deletePartyOrder/:id", async (req, res) => {
  const orderId = req.params.id;
  if (!isValidObjectId(orderId))
    return res.status(401).json({ error: "Invalid Request" });

  const order = await PartyOrder.findById(orderId);
  if (!order) return res.status(401).json({ error: "Order not found!" });

  await Party.findByIdAndDelete(orderId);
  res.json({ message: "Order removed successfully!" });
});

// Fetch Party vise Order Info using : GET "/api/party/getPartyViseOrdersInfo"
router.get("/getPartyViseOrdersInfo", async (req, res) => {
  const { partyId } = req.query;
  if (!isValidObjectId(partyId))
    return res.status(401).json({ error: "Invalid Request" });

  const order = await PartyOrder.find({ partyId: partyId }).sort({
    createdAt: -1,
  });

  if (!order) return res.status(401).json({ error: "Order not found!" });

  res.json({
    PartyOrder: order.map((order) => ({
      id: order._id,
      itemName: order.itemName,
      quantity: order.quantity,
      amount: order.amount,
      date: order.date,
    })),
  });
});

// Update Order Info using : PUT "/api/party/updatePartyOrder/id"
router.put(
  "/updatePartyOrder/:id",
  [
    body("itemName", "Enter a valid Item Name").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    const { itemName, quantity, amount } = req.body;

    const orderId = req.params.id;
    if (!isValidObjectId(orderId))
      return res.status(401).json({ error: "Invalid Request" });

    const order = await PartyOrder.findById(orderId);
    if (!order) return res.status(401).json({ error: "Order not found!" });

    order.itemName = itemName;
    order.quantity = quantity;
    order.amount = amount;

    await order.save();

    res.json({
      order: {
        id: order._id,
        itemName,
        quantity,
        amount,
      },
    });
  }
);

module.exports = router;
