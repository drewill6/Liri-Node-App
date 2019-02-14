require("dotenv").config();
var keys = require('./keys');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');
var moment = require('moment')

var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});

//list of commands for liri to take in...
var liriCommand = process.argv[2];

switch (liriCommand) {

  case 'concert-this':
    var artist = "";
    for (var i = 3; i < process.argv.length; i++) {
      if (i !== 3) artist += "-"
      artist += process.argv[i];
    }
    concertThis(artist);
    break;

  case 'spotify-this-song':
    var songName = process.argv.slice(3).join(" ");
    if (songName == undefined || songName == '') {
      songName = "Til The Cops Come Knockin";
    }
    spotifyThisSong(songName);
    break;

  case 'movie-this':
    var movieName = process.argv.slice(3).join(" ");

    if (movieName == undefined) {
      movieName = "Mr. Nobody";
    }
    movieThis(movieName);
    break;

  case 'do-what-it-says':
    doWhatItSays();
    break;
};

function concertThis(artist) {
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {
    console.log(artist)
    var body = JSON.parse(body);
        console.log("    ")
        console.log("-------------------------------------")
        console.log("    ")
        console.log("Upcoming concerts for " + artist + ", ");
        for(var i = 0; i < body.length; i++)
        {
          var set = i;
          console.log(body[set]);
          var date = moment(body[set].datetime).format("MM/DD/YYYY")
          console.log(body[set].venue.city + ", " + "at " + body[set].venue.name + ", " + "on " + date)
        }
      });
}

function spotifyThisSong(songName) {
  spotify.search({ type: 'track', query: songName, limit: 20 },
    function (err, data) {

      if (err) {
        return console.log('Error occurred: ' + err);
      }
      //console.log(data);
      var albumInfo = data.tracks.items;
      for (var i = 0; i < albumInfo.length; i++) {

        if (albumInfo[i] != undefined) {
          var spotifyResults = "\n\n" +
            "Artist: " + albumInfo[i].artists[0].name + "\n" +
            "Song Name: " + albumInfo[i].name + "\n" +
            "Preview Song: " + albumInfo[i].preview_url + "\n" +
            "Album: " + albumInfo[i].album.name + "\n";

            console.log(spotifyResults);
          // console.log("");
        }
      }
    });
}

function movieThis(movieName) {
  request('http://www.omdbapi.com/?i=tt3896198&apikey=bbbea1e6&s=' + process.argv[3], function (error, response, body) {
  var results = JSON.parse(body).Search;
  for(var i = 0; i < results.length; i++)
  {
    var result=results[i];
    console.log("Title : " + result.Title);
    console.log("Year : " + result.Year);
    console.log("IMDB Rating : " + result.imdbRating);
    console.log("Movie Plot : " + result.Plot);
    console.log("Actors : " + result.Actors);
    console.log("Language : " + result.Language);
    console.log("Country : " + result.Country);
  }
    

  });
}
  //fs.readFile('/etc/passwd', (err, data) => {
  //if (err) throw err;
 
function doWhatItSays() {
  fs.readFile('random.txt', 'utf8',function (err,data){
    if (err) throw err;

    var dataArr = data.split(' ');
    var command = dataArr[0];

    switch (command) {

  case 'concert-this':
    var artist = "";
    for (var i = 1; i < dataArr.length; i++) {
      if (i !== 1) artist += "-"
      artist += dataArr[i];
    }
    concertThis(artist);
    break;

  case 'spotify-this-song':
    var songName = dataArr.slice(1).join("");
    if (songName == undefined || songName == '') {
      songName = "Til The Cops Come Knockin";
    }
    spotifyThisSong(songName);
    break;

  case 'movie-this':
    var movieName = dataArr.slice(1).join("");

    if (movieName == undefined) {
      movieName = "Mr. Nobody";
    }
    movieThis(movieName);
    break;
}
  });
}
