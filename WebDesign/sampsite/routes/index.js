var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/list', function(req, res, next) {
  const MongoClient = mongodb.MongoClient;

  const url = 'mongodb://localhost:27017/sampsite';

  MongoClient.connect(url,function(err, db){
    if(err){
      console.log('Unable to connect to server');
    } else {
      console.log('Connected');

      var collection = db.collection('User');
      collection.find({}).toArray( function(err, result) {
        if(err){
          res.send(err);
        } else if ( result.length) {
          res.render('userlist', {
            "userList" : result
          });
        } else {
            res.send('No doc found');
          }
        db.close();
      })
    }
  })
});


module.exports = router;
