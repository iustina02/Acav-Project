const Prod = require("../../models/products");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/", (req, res, next) => {
  const { name, sku, price } = req.body;

  const newProd = new Prod({
    _id: new mongoose.Types.ObjectId(),
    name,
    sku,
    price
  });

  newProd
    .save()
    .then(result => {
      res.status(201).json({
        message: "Register successfully done"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
