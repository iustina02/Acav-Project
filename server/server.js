const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var PORT = process.env.PORT || 4000;
const path = require("path");

const getLogin = require('./routes/login/get');
const app = express();



app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use('/models',require('./routes/login/product'));
app.use('/get',require('./routes/login/get'));
var server = http.Server(app);
mongoose 
  .connect(
'mongodb+srv://test123:12345@projdb-spnnh.mongodb.net/test?retryWrites=true&w=majority'   
 )
  .then(result => {
    // app.listen(PORT);
    server.listen(PORT, function(){
      console.log("DSAdsaa");
    });
  })
  .catch(err => console.log(err));
