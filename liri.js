var request = require('request');
var fs = require('fs');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

var keys = require('./keys');
var tweet = new Twitter(keys.twitterKeys);
var action = process.argv[2];
var userRequest = process.argv[3];

var params = {
    screen_name: 'cmeshram19',
    count: 20
}


switch (action) {
    case 'my-tweets':
        getTweets();
        break;
    case 'spotify-this-song':
        getSpotifyInfo(userRequest);
        break;
    case 'movie-this':
        getMovieInfo(userRequest);
        break;
    case 'do-what-it-says':
        doIt();
        break;
}


// 'my-tweets' command invokes getTweets function
function getTweets() {
    tweet.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error && response.statusCode == 200) {
            fs.appendFile('terminal.log', ('=============== LOG ENTRY BEGIN ===============\r\n' + Date() + '\r\n \r\nTERMINAL COMMANDS:\r\n$: ' + process.argv + '\r\n \r\nDATA OUTPUT:\r\n'), function(err) {
                if (err) throw err;
            });
            console.log(' ');
            console.log('Last 20 Tweets:')
            for (i = 0; i < tweets.length; i++) {
                var number = i + 1;
                console.log(' ');
                console.log([i + 1] + '. ' + tweets[i].text);
                console.log('Created on: ' + tweets[i].created_at);
                console.log(' ');
                fs.appendFile('terminal.log', (number + '. Tweet: ' + tweets[i].text + '\r\nCreated at: ' + tweets[i].created_at + ' \r\n'), function(err) {
                    if (err) throw err;
                });
            }
            fs.appendFile('terminal.log', ('=============== LOG ENTRY END ===============\r\n \r\n'), function(err) {
                if (err) throw err;
            });
        }
    });
}


// 'spotify-this-song' command invokes getSpotifyInfo(userRequest)
function getSpotifyInfo(userRequest) {
    var spotify = new Spotify({
        id: "f39bab0d160e4672939bf8cfcb5293d8",
        secret: "40bbec9cc72144439ff7ffaf9d12e717"
    });

    if (userRequest == null) {
        userRequest = 'The Sign';
    }
    
    spotify.search({ type: 'track', query: userRequest }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        // caching for perfromance improvement
        var tracks = data.tracks.items[0];
        console.log("Artist(s): ", tracks.artists[0].name);
        console.log("Song: ", tracks.name);
        console.log('Preview Link: ' + tracks.preview_url);
        console.log('Album: ' + tracks.album.name);
        console.log(' ');
        fs.appendFile('terminal.log', ('=============== LOG ENTRY BEGIN ===============\r\n' + Date() +'\r\n \r\nTERMINAL COMMANDS:\r\n$: ' + process.argv + '\r\n \r\nDATA OUTPUT:\r\n' + 'Artist: ' + tracks.artists[0].name + '\r\nSong: ' + tracks.name + '\r\nPreview Link: ' + tracks.preview_url + '\r\nAlbum: ' + tracks.album.name + '\r\n=============== LOG ENTRY END ===============\r\n \r\n'), function(err) {
            if (err) throw err;
        });

    });

}

// 'movie-this' command invokes getMovieInfo function
function getMovieInfo(userRequest) {
    if (userRequest == null) {
        userRequest = 'Mr. Nobody';
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + userRequest + "&y=&plot=short&apikey=40e9cece";
    request( queryUrl, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var movieData = JSON.parse(body);
            console.log(' ');
            console.log('Title: ' + movieData.Title);
            console.log('Year: ' + movieData.Year);
            console.log('IMDb Rating: ' + movieData.imdbRating);
            console.log('Rotten Tomatoes Rating: ' + movieData.Ratings[1].Value);
            console.log('Country: ' + movieData.Country);
            console.log('Language: ' + movieData.Language);
            console.log('Plot: ' + movieData.Plot);
            console.log('Actors: ' + movieData.Actors);
            console.log(' ');
            fs.appendFile('log.txt', ('=============== LOG ENTRY BEGIN ===============\r\n' + Date() + '\r\n \r\nTERMINAL COMMANDS: ' + process.argv + '\r\nDATA OUTPUT:\r\n' + 'Title: ' + movieData.Title + '\r\nYear: ' + movieData.Year + '\r\nIMDb Rating: ' + movieData.imdbRating + '\r\nCountry: ' + movieData.Country + '\r\nLanguage: ' + movieData.Language + '\r\nPlot: ' + movieData.Plot + '\r\nActors: ' + movieData.Actors + '\r\nRotten Tomatoes Rating: ' + movieData.Ratings[1].Value + '\r\n =============== LOG ENTRY END ===============\r\n \r\n'), function(err) {
                if (err) throw err;
            });
        }
    });
}

// 'do-what-it-says' command invokes doIt function
function doIt() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            console.log(error);
        } else {
            var dataArr = data.split(',');
            if (dataArr[0] === 'spotify-this-song') {
                getSpotifyInfo(dataArr[1]);
            }
            if (dataArr[0] === 'movie-this') {
                getMovieInfo(dataArr[1]);
            }
        }
    });
}