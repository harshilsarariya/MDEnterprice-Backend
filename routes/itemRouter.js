const express = require("express");
const router = express.Router();
const Item = require("../models/ItemSchema");
const { body, validationResult } = require("express-validator");
const { isValidObjectId } = require("mongoose");

// ** Item Section ** //

// Add item using : POST "/api/item/addItem"
router.post(
  "/addItem",
  [
    body("itemName", "Enter a valid Item Name ").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    let success = false;
    try {
      const { itemName, sellingPrice, quantity } = req.body;
      // If there are error then return the bad request and error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const newItem = new Item({ itemName, sellingPrice, quantity });

      const saveItem = await newItem.save();
      success = true;
      res.json({ success, saveItem });
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }
);

// Delete item using : DELETE "/api/item/deleteItem/id"
router.delete("/deleteItem/:id", async (req, res) => {
  const itemId = req.params.id;
  if (!isValidObjectId(itemId))
    return res.status(401).json({ error: "Invalid Request" });

  const item = await Item.findById(itemId);
  if (!item) return res.status(401).json({ error: "Item not found!" });

  await Item.findByIdAndDelete(itemId);
  res.json({ message: "Item removed successfully!" });
});

// Update item using : PUT "/api/item/updateItem/id"
router.put(
  "/updateItem/:id",
  [
    body("itemName", "Enter a valid Item Name ").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    const { itemName, sellingPrice, quantity } = req.body;
    const itemId = req.params.id;
    if (!isValidObjectId(itemId))
      return res.status(401).json({ error: "Invalid Request" });

    const item = await Item.findById(itemId);
    if (!item) return res.status(401).json({ error: "Item not found!" });

    item.itemName = itemName;
    item.sellingPrice = sellingPrice;
    item.quantity = quantity;

    await item.save();

    res.json({
      item: {
        id: item._id,
        itemName,
        sellingPrice,
        quantity,
      },
    });
  }
);

// Fetch Parties Info using : GET "/api/item/getItems"
router.get("/getItems", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Search Item Name : GET "/api/item/searchItemByName"
router.get("/searchItemByName", async (req, res) => {
  try {
    const { itemName } = req.query;
    let item = await Item.find({
      $and: [{ itemName: { $regex: itemName, $options: "m" } }],
    }).sort({
      createdAt: -1,
    });
    if (!item) {
      return res.status(404).send("Item Name Not Found!");
    }
    res.json(item);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});


module.exports = router;
