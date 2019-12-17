const Prod = require("../../models/products");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/:id_query", (req, res, next) => {
  const { id_query} = req.params;

    Prod.find({_id:id_query })
  .then(function(document){
    return res.json(document);
  }).catch(err => {
    res.status(500).json({
      error: err
    });
  });

});
  module.exports = router;
