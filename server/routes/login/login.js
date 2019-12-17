const User = require("../../models/user");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const jwt = require('jsonwebtoken');
const secret = "7306a2b35da8e825c4b9e16177be028c44183c01f67a9c6a5b80844376f0425b02b6bc0d62087963513a4355fcb1a539e6dac0e1d4eb8969e62805bf522a783b";

router.post("/", (req, res, next) => {
  const { user, password } = req.body;
  User.find({"user":user,"password":password})
  .then(function(document){
    let thisUser = {id:document[0]._id,user:document[0].user};
    
    let jww = jwt.sign(thisUser,secret,{expiresIn:"60m"});
     res.json(jww);
  }).catch(err =>{
    res.json({"error":"invalid user or password "});
})
});

module.exports = router;
