const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: {
    type: String,
    required: true,
    unique: true,
    index:true

  },
  password: {
    type: String,
    required: true
  }
});
UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);
