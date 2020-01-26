
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');


// SPOTIFY STUFF
var client_id = '7f5197e9b2104006bc395d66a56850e1'; // Your client id
var client_secret = '3c514725454c491a89020699ee475ab4'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri


// DATABASE
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://test:test@cluster0-60hcf.azure.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri,{ useUnifiedTopology: true });


var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
var stateKey = 'spotify_auth_state';
var app = express();
app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());



// LOGIN FUNCTION
app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative user-top-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
              code: code,
              redirect_uri: redirect_uri,
              grant_type: 'authorization_code'
            },
            headers: {
              'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
      };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;
            user_name = "";

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };


        request.get(options, function(error, response, body) {
          let user_url = "https://api.spotify.com/v1/me";
          

          request({url:user_url, headers:{ 'Authorization': 'Bearer ' + access_token }},function (err,respon) {
            if(respon) {
              let user_data = JSON.parse(respon.body);

              client.connect(err => {
                const collection_user = client.db("AcavDB").collection("User");
                const collection_top_user_artists = client.db("AcavDB").collection("Top_user_artists");
                const collection_top_user_tracks = client.db("AcavDB").collection("Top_user_tracks");
                const collection_top_user_gen = client.db("AcavDB").collection("Top_user_gen");
                const collection_groups = client.db("AcavDB").collection("Groups");
                console.log('All good in DB I guess');


                collection_user.find({'name': user_data.display_name}).toArray(function(err,docs){
                  if(err){
                    console.log('eroare');
                  } else if(docs.length) {
                    console.log('User already in DB');
                    user_name = user_data.display_name;

                    //DELETE TOP ARTISTS 
                    collection_top_user_artists.deleteMany({'user_name': user_name},function(err,obj) {
                      if (err) throw err;
                      console.log(obj.result.n + " document(s) deleted");
                    });

                    //DELETE TOP TRACKS
                    collection_top_user_tracks.deleteMany({'user_name': user_name},function(err,obj) {
                      if (err) throw err;
                      console.log(obj.result.n + " document(s) deleted");
                    });

                    //DELETE TOP GEN
                    collection_top_user_gen.deleteMany({'user_name': user_name},function(err,obj) {
                      if (err) throw err;
                      console.log(obj.result.n + " document(s) deleted");
                    });

                    //DELETE GROUPS USER
                    collection_groups.deleteMany({'user_name': user_name},function(err,obj) {
                      if (err) throw err;
                      console.log(obj.result.n + " document(s) deleted");
                    });

                    //TOP ARTISTS USER GET IN DB UPDATE  + GENRES
                    let top_artists_url = "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10&offset=5";

                    request({url:top_artists_url, headers: { 'Authorization': 'Bearer ' + access_token }}, function(err,res){
                      if(res){
                      let top_artists = JSON.parse(res.body);
                      top_artists.items.forEach(artist =>{

                        collection_top_user_artists.insertOne({
                          user_name: user_data.display_name,
                          artist: artist.name,
                          popularity: artist.popularity},
                            function(err,res) {
                            if(err) throw err;
                            console.log("1 artists + popularity inserted");
                            });

                            artist.genres.forEach(genre => {

                            collection_top_user_gen.insertOne({
                              user_name: user_data.display_name,
                              genre: genre,
                              popularity: artist.popularity},
                              function(err,res) {
                                if(err) throw err;
                                console.log("1 gen + popularity inserted");
                            })

                            collection_groups.insertOne({
                              user_name: user_data.display_name,
                              genre: genre},
                              function(err,res) {
                                if(err) throw err;
                                console.log("1 gen + user inserted");
                            })
                          })
                      })
                      } else if (err){
                        console.log('Nu s-a putu citi top artists');
                      }
                    });

                    //TOP TRACKS USER GET IN DB UPDATE 
                    let top_tracks_url = "https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=10&offset=5";

                    request({url:top_tracks_url, headers: { 'Authorization': 'Bearer ' + access_token }}, function(err,res){
                      if(res){
                      let top_tracks = JSON.parse(res.body);
                      top_tracks.items.forEach(track =>{

                        collection_top_user_tracks.insertOne({
                          user_name: user_data.display_name,
                          track: track.name,
                          popularity: track.popularity},
                            function(err,res) {
                            if(err) throw err;
                            console.log("1 track + popularity inserted");
                            });
                        
                      })
                      } else if (err){
                        console.log('Nu s-a putu citi top artists');
                      }
                    });


                      // we can also pass the token to the browser to make requests from there
                      res.redirect('/#' +
                      querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token,
                        user_name: user_name
                      }));
                  } else {

                    // CHECK ON NEW ACC + INSERT IN DB
                    console.log('no user found');
                    collection_user.insertOne({
                      location: user_data.country,
                      name: user_data.display_name,
                      hobby: 'no hooby'}, function(err,res) {
                        if(err) throw err;
                        console.log("1 document inserted");
                    });

                    //TOP ARTISTS USER GET IN DB INSERT + GENRES
                    let top_artists_url = "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10&offset=5";

                    request({url:top_artists_url, headers: { 'Authorization': 'Bearer ' + access_token }}, function(err,res){
                      if(res){
                      let top_artists = JSON.parse(res.body);
                      top_artists.items.forEach(artist =>{

                        collection_top_user_artists.insertOne({
                          user_name: user_data.display_name,
                          artist: artist.name,
                          popularity: artist.popularity},
                            function(err,res) {
                            if(err) throw err;
                            console.log("1 artists + popularity inserted");
                            });

                        artist.genres.forEach(genre => {
                          collection_top_user_gen.insertOne({
                            user_name: user_data.display_name,
                            genre: genre,
                            popularity: artist.popularity},
                            function(err,res) {
                              if(err) throw err;
                              console.log("1 gen + popularity inserted");
                          })

                          collection_groups.insertOne(({
                            user_name: user_data.display_name,
                            genre: genre},
                              function(err,res) {
                                if(err) throw err;
                                console.log("1 gen + popularity inserted");
                          }));
                        })
                      })
                      } else if (err){
                        console.log('Nu s-a putu citi top artists');
                      }
                    });

                    //TOP TRACKS USER GET IN DB INSERT
                    let top_tracks_url = "https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=10&offset=5";

                    request({url:top_tracks_url, headers: { 'Authorization': 'Bearer ' + access_token }}, function(err,res){
                      if(res){
                      let top_tracks = JSON.parse(res.body);
                      top_tracks.items.forEach(track =>{

                        collection_top_user_tracks.insertOne({
                          user_name: user_data.display_name,
                          track: track.name,
                          popularity: track.popularity},
                            function(err,res) {
                            if(err) throw err;
                            console.log("1 track + popularity inserted");
                            });
                      })
                      } else if (err){
                        console.log('Nu s-a putu citi top artists');
                      }
                    });

                    user_name = user_data.display_name;
                    res.redirect('/#' +
                    querystring.stringify({
                      access_token: access_token,
                      refresh_token: refresh_token,
                      user_name: user_name
                    }));
                  }
                })
                  // DISPLAY GRAPHS
        

                  // TOP ARTISTS
                  app.get('/top_artists', function(req, res) {
                    // console.log(user_name);
        
                    collection_top_user_artists.find({'user_name': user_name}).toArray( function(err, result) {
                      if(err){
                        console.log(err);
                      } else if ( result.length) {
                        console.log('We found artists results!');
                        result.forEach(({ artist, popularity }) => res.cookie(artist,popularity));
        
                        res.redirect('/#' +
                        querystring.stringify({
                          access_token: access_token,
                          refresh_token: refresh_token,
                          user_name: user_name
                        }));
                      } else {
                        console.log('No results found!');
                          res.redirect('/#' +
                          querystring.stringify({
                            access_token: access_token,
                            refresh_token: refresh_token,
                            user_name: user_name
                          }));
                        }
                    });
                  });

                  // TOP TRACKS
                  app.get('/top_tracks', function(req, res) {
                    // console.log(user_name);
        
                    collection_top_user_tracks.find({'user_name': user_name}).toArray( function(err, result) {
                      if(err){
                        console.log(err);
                      } else if ( result.length) {
                        console.log('We found tracks results!');
                        result.forEach(({ track, popularity }) => res.cookie(track,popularity));
        
                        res.redirect('/#' +
                        querystring.stringify({
                          access_token: access_token,
                          refresh_token: refresh_token,
                          user_name: user_name
                        }));
                      } else {
                        console.log('No results found!');
                          res.redirect('/#' +
                          querystring.stringify({
                            access_token: access_token,
                            refresh_token: refresh_token,
                            user_name: user_name
                          }));
                        }
                    });
                  });


                  // TOP GENRES
                  app.get('/top_genres', function(req, res) {
                    // console.log(user_name);
        
                    collection_top_user_gen.find({'user_name': user_name}).toArray( function(err, result) {
                      if(err){
                        console.log(err);
                      } else if ( result.length) {
                        console.log('We found genres results!');
                        result.forEach(({ genre, popularity }) => res.cookie(genre,popularity));
        
                        res.redirect('/#' +
                        querystring.stringify({
                          access_token: access_token,
                          refresh_token: refresh_token,
                          user_name: user_name
                        }));
                      } else {
                        console.log('No results found!');
                          res.redirect('/#' +
                          querystring.stringify({
                            access_token: access_token,
                            refresh_token: refresh_token,
                            user_name: user_name
                          }));
                        }
                    });
                  });




                  // DISPLAY GROUPS
        

                  app.get('/groups', function(req, res) {
                    collection_groups.find({'user_name': user_name}).toArray( function(err, result) {
                      if(err){
                        console.log(err);
                      } else if ( result.length) {
                        console.log('We found groups results!');
                        result.forEach(({ genre}) => res.cookie(genre));
                        
                        res.redirect('/#' +
                        querystring.stringify({
                          access_token: access_token,
                          refresh_token: refresh_token,
                          user_name: user_name
                        }));
                      } else {
                        console.log('No results found!');
                          res.redirect('/#' +
                          querystring.stringify({
                            access_token: access_token,
                            refresh_token: refresh_token,
                            user_name: user_name
                          }));
                        }
                    });
                  });

              });
            }
          }
          )
        });

      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});


console.log('Listening on 8888');

var unirest = require("unirest");

var req = unirest("GET", "https://deezerdevs-deezer.p.rapidapi.com/search");

req.query({
	"q": "adele"
});

req.headers({
	"x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
	"x-rapidapi-key": "843ea8ff82mshd1b05d9f1443ce7p101a15jsn6f9d22f2cf40"
});


req.end(function (res) {
	if (res.error) throw new Error(res.error);

	// console.log(res.body);
});

app.get('/log_out', function(req, res) {

  var state = "";
  res.cookie(stateKey, state);

  res.redirect('/');
  console.log("Logged Out")
});

app.listen(8888);
