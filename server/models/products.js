const mongoose = require("mongoose");

const ProdSchema = new mongoose.Schema({
_id: mongoose.Schema.Types.ObjectId,
 name: {type: String},
 sku: {type: String},
 price: {type: Number}
});


module.exports = mongoose.model("Prod", ProdSchema);
