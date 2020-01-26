
const express = require('express');
const bodyParser =  require('body-parser');
const app = express();
const path = require('path');


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://test:test@cluster0-60hcf.azure.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri,{ useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("AcavDB").collection("User");
  console.log('All good I guess');
  console.log('Connected');

  collection.find({}).toArray( function(err, result) {
    if(err){
      console.log(err);
    } else if ( result.length) {
      console.log(result);
    } else {
      console.log('No doc found');
      }
  })

  collection.insertOne({
  location: 'eune',
  name: 'Test2',
  hooby: 'no code'}, function(err,res) {
    if(err) throw err;
    console.log("1 document inserted");
    client.close();
  })
});

