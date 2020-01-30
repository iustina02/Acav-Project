
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

// DEEZER
var unirest = require("unirest");

var req = unirest("GET", "https://deezerdevs-deezer.p.rapidapi.com/search");


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
            user_display_name = "";

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };


      request.get(options, function(error, response, body) {
        let user_url = "https://api.spotify.com/v1/me";
            
        user_display_name =body.display_name;

        var list_top_artists_artist =[];
        var list_top_artists_popularity =[];
        var list_top_tracks_track =[];
        var list_top_tracks_popularity =[];
        var list_top_genres_genre =[];
        var list_top_genres_popularity =[];
        var user_group = [];
        var genree = [];

        console.log(user_display_name);

        console.log('All good in DB I guess');
          client.connect(err => {

          const collection_user = client.db("AcavDB").collection("User");
          const collection_top_user_artists = client.db("AcavDB").collection("Top_user_artists");
          const collection_top_user_tracks = client.db("AcavDB").collection("Top_user_tracks");
          const collection_top_user_gen = client.db("AcavDB").collection("Top_user_gen");
          const collection_groups = client.db("AcavDB").collection("Groups");

          collection_user.find({'name': user_display_name}).toArray(function(err,docs){
            if(err){
              console.log('eroare');
            } else if(docs.length) {
              console.log('User already in DB');
              user_name = user_display_name;
      
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
                    user_name: user_display_name,
                    artist: artist.name,
                    popularity: artist.popularity},
                      function(err,res) {
                      if(err) throw err;
                      console.log("1 artists + popularity inserted");
                      });
      
                      artist.genres.forEach(genre => {
      
                      collection_top_user_gen.insertOne({
                        user_name: user_display_name,
                        genre: genre,
                        popularity: artist.popularity},
                        function(err,res) {
                          if(err) throw err;
                          console.log("1 gen + popularity inserted");
                      })
      
                      collection_groups.insertOne({
                        user_name: user_display_name,
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
                    user_name: user_display_name,
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
  

            } else {
      
              // CHECK ON NEW ACC + INSERT IN DB
              console.log('no user found');
              collection_user.insertOne({
                spotify_id: user_data.id,
                location: user_data.country,
                name: user_display_name,
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
                  console.log('Nu s-a putu citi top tracks');
                }
              });
    
            }
          })
          // DISPLAY GRAPHS

          // TOP ARTISTS
          collection_top_user_artists.find({'user_name': user_display_name}).toArray( function(err, result) {
            if(err){
              console.log(err);
            } else if ( result.length) {
              console.log('We found artists results!');

              result.forEach(({ artist, popularity }) =>{
                list_top_artists_artist.push(artist);
                list_top_artists_popularity.push(popularity);
              });
            } else {
              console.log('No results found!');
              }
              res.cookie("list_top_artists_artist",list_top_artists_artist);
              res.cookie("list_top_artists_popularity",list_top_artists_popularity);
          });


          // TOP TRACKS
          collection_top_user_tracks.find({'user_name': user_display_name}).toArray( function(err, result) {
            if(err){
              console.log(err);
            } else if ( result.length) {
              console.log('We found tracks results!');
              
              for(let i = 0; i < result.length; i++){
                list_top_tracks_track.push(result[i].track);
                list_top_tracks_popularity.push(result[i].popularity);
              }

            } else {
              console.log('No results found!');
              }
              res.cookie("list_top_tracks_track",list_top_tracks_track);
              res.cookie("list_top_tracks_popularity",list_top_tracks_popularity);
          });



          // TOP GENRES
          collection_top_user_gen.find({'user_name': user_display_name}).toArray( function(err, result) {
            if(err){
              console.log(err);
            } else if ( result.length) {
              console.log('We found genres results!');
              result.forEach(({ genre, popularity }) => {
                list_top_genres_genre.push(genre);
                list_top_genres_popularity.push(popularity);
              });
            } else {
              console.log('No results found!');
              }
              res.cookie("list_top_genres_genre",list_top_genres_genre);
              res.cookie("list_top_genres_popularity",list_top_genres_popularity);
          });


          // DISPLAY GROUPS

          collection_groups.find({}).toArray( function(err, result) {
              if(err){
                console.log(err);
              } else if ( result.length) {
                console.log('We found groups results!');
                result.forEach(({ genre,user_name}) => {
                  if(user_name == user_display_name) {
                    user_group.push(genre);
                    genree.push(genre);
                  } else {
                    genree.push(genre);
                  }
                })
              } else {
                console.log('No results found!');
              }
              res.cookie("user_groups",user_group);
              res.cookie("all_groups",genree);
          });
          })

        setTimeout(function(){
        res.cookie("user_name_display",user_display_name);
        res.cookie("access_token",access_token);

        res.redirect('/#page=home');
        },2000);
      })
      }
      else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

// SEARCH IN DB
app.get('/search', function(request,res){
  var cookies = parseCookies(request);

  console.log(cookies.data);


  // GENRES

  let users = [];
  let users2 =[];
  let users_id_spotify = [];
  let cookie_gen = "gen";
  let cookie_location = "location";
  if(typeof cookies.data != 'undefined'){
    cookie_gen = cookies.data.split("/")[0];
    if (cookies.data.length > 0){
      cookie_location = cookies.data.split("/")[1];
    }
  }

    const collection_user = client.db("AcavDB").collection("User");
    const collection_top_user_artists = client.db("AcavDB").collection("Top_user_artists");
    const collection_top_user_tracks = client.db("AcavDB").collection("Top_user_tracks");
    const collection_top_user_gen = client.db("AcavDB").collection("Top_user_gen");
    const collection_groups = client.db("AcavDB").collection("Groups");

    console.log(cookie_gen,cookie_location)

    collection_groups.find({'genre': cookie_gen}).toArray(function(err,result){
      if(err){
        console.log(err);
      } else if ( result.length) {
        console.log('We found users results of genres ' + cookie_gen);

        result.forEach(({user_name}) => {
          if(!(users.includes(user_name))){
            users.push(user_name);
          }
        })

        if(cookie_location == 'location'){
          collection_user.find({}).toArray(function(err,result){
            if(err){
              console.log(err);
            } else if (result.length){
              console.log('We found id of users that like ' + cookie_gen);
              for ( let i = 0; i < result.length; i++){
                for( let j = 0; j < users.length; j++){
                  if((result[i].name == users[j]) && !(users_id_spotify.includes(result[i].spotify_id))){
                    users_id_spotify.push(result[i].spotify_id);
                  }
                }
              }
            }
            setTimeout(function(){
            console.log(users,users_id_spotify)
            res.cookie('users_gen',JSON.stringify(users));
            res.cookie('users_id',JSON.stringify(users_id_spotify));

            res.redirect('/#page=home');
            },2000);

          })
        }
        else{
          collection_user.find({'location': cookie_location}).toArray(function(err,result){
            if(err){
              console.log(err)
            } else if (result.length){
              console.log('We found id of users that like ' + cookie_gen + ' and are from '+cookie_location);
              for ( let i = 0; i < result.length; i++){
                for( let j = 0; j < users.length; j++){
                  if((result[i].name == users[j]) && !(users_id_spotify.includes(result[i].spotify_id))){
                    users_id_spotify.push(result[i].spotify_id);
                    users2.push(result[i].display_name);
                  }
                }
              }
            }
            
            setTimeout(function(){
              res.cookie('users_gen',JSON.stringify(users2));
              res.cookie('users_id',JSON.stringify(users_id_spotify));
  
              res.redirect('/#page=home');
              },2000);
          })
        }

      } else {
        console.log('No genres results found of ' + cookie_gen);

        if(cookie_location != 'location'){
          collection_user.find({'location': cookie_location}).toArray(function(err,result){
            if(err){
              console.log(err)
            } else if (result.length){
              console.log('We found id of users that are from '+cookie_location);

              result.forEach(({name}) => users.push(name))

              for ( let i = 0; i < result.length; i++){
                for( let j = 0; j < users.length; j++){
                  if((result[i].name == users[j]) && !(users_id_spotify.includes(result[i].spotify_id))){
                    users_id_spotify.push(result[i].spotify_id);
                  }
                }
              }
            }

            setTimeout(function(){
              console.log(users,users_id_spotify)
              res.cookie('users_gen',JSON.stringify(users));
              res.cookie('users_id',JSON.stringify(users_id_spotify));
  
              res.redirect('/#page=home');
              },2000);
          })
        }
        else{
          setTimeout(function(){
            console.log(users,users_id_spotify)
            res.cookie('users_gen',JSON.stringify(users));
            res.cookie('users_id',JSON.stringify(users_id_spotify));

            res.cookie('data', '1', { expires: new Date(Date.now() + 100), httpOnly: true });

            res.redirect('/#page=home');
            },2000);
        }
      }
    })
});

// SEARCH USERS

let user_name_playlist = [];
let user_name_tracks_id = []
// GENRES + PLAYLIST
app.get('/search_user', function(req,res){

  var cookies = parseCookies(req);
  access_token =cookies.access_token;

  let id_user_spotify = cookies.user;
  console.log(id_user_spotify);

  let url_get_user_playlist = "https://api.spotify.com/v1/users/"+id_user_spotify+"/playlists";

  request({url:url_get_user_playlist, headers: { 'Authorization': 'Bearer ' + access_token }}, function(err,response){
    if(response){
      let user_playlist = JSON.parse(response.body);
      if(!(user_playlist.error))
      {
        console.log("We found user's playlists.")
        user_playlist.items.forEach(({tracks,name}) => {
          user_name_playlist.push(name);
          user_name_tracks_id.push(tracks.href);
        })
        setTimeout(function(){
          res.cookie('user_name_playlist',user_name_playlist);

          res.redirect('/#page=home');
          },2000);
    } else {
      console.log("cound not find user's playlists.");
      
      if(user_name_playlist.length > 0){
        for(i = 0; i< user_name_playlist.length; i++ ){
          if(user_name_playlist[i] == id_user_spotify){
            var playlist_id = user_name_tracks_id[i];
          }
        }
      }

      if(playlist_id){
        console.log("Search API playlist" + playlist_id);
        let url_get_user_playlist = playlist_id;

        request({url:url_get_user_playlist, headers: { 'Authorization': 'Bearer ' + access_token }}, function(err,response){
          if(response){
            let tracks_popularity = JSON.parse(response.body);
            if(!(tracks_popularity.error))
            {
              console.log("We found playlist!");
              let track_name = [];
              let track_popularity = [];
              tracks_popularity.items.forEach(({track}) => {
                track_name.push(track.name);
                track_popularity.push(track.popularity);
              })
              setTimeout(function(){
                // user_name_playlist = [];
                res.cookie('playlist_track_pop',track_popularity);
                res.cookie('playlist_track_name',track_name);
      
                res.redirect('/#page=home');
                },2000);

            } else {
              console.log("We did not found playlist!");
              res.redirect('/#page=home');

            }
          }
          else{
            console.log("Some Error.");
            res.redirect('/#page=home');
          }
        })
      }else{
        res.redirect('/#page=home');
      }
    }
    } else {
      console.log('Nu s-a putu citi playlistul');
      res.redirect('/#page=home');
    }
  });

})


// ARTISTS TRACKS
app.get('/search_artist_track', function(req,res){


  var cookies = parseCookies(req);
  let search_tag = cookies.search;
  let url_get_search = "https://api.deezer.com/search?q="+ search_tag;

  request({url:url_get_search }, function(err,response){
    if(err) {
      console.log(err);
      res.redirect('/#page=home');
    }
    else{
      let seach_body = JSON.parse(response.body);
      let albums = [];
      let albums_id = [];
      seach_body.data.forEach(({album})=>{
        if(!(albums.includes(album.title))){
          albums.push(album.title);
          albums_id.push(album.id)
        }
      })
      if(albums.length>0){
        console.log("Sunt albume de vazut!")
        var fans = [];
        var contor = albums_id.length;
      for( i = 0; i < albums_id.length ; i ++){
        let url_get_album = "https://api.deezer.com/album/"+albums_id[i];
        request({url:url_get_album }, function(err,response){
          contor = contor -1;
          if(err) {
            console.log("Eroare")
            console.log(err);
          } else{
            let album_data =  JSON.parse(response.body);
            fans.push(album_data.fans);
            if( contor == 0){
              res.cookie('search_result',albums);
              res.cookie('fans',fans);

              res.redirect('/#page=home');
            }
          }
        })
      }
    }
    else {
      res.redirect('/#page=home');
    }

    }

  })
})

function parseCookies (request) {
  var list = {},
      rc = request.headers.cookie;

  rc && rc.split(';').forEach(function( cookie ) {
      var parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  return list;
}


req.query({
  "q": "adele"
});

req.headers({
  "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  "x-rapidapi-key": "843ea8ff82mshd1b05d9f1443ce7p101a15jsn6f9d22f2cf40"
});


console.log('Listening on 8888');


req.end(function (res) {
	if (res.error) throw new Error(res.error);

	// console.log(res.body);
});

app.get('/log_out', function(req, res) {
  res.clearCookie();

  res.redirect('https://www.spotify.com/ro/logout/');
  console.log("Logged Out")
});

app.listen(8888);
