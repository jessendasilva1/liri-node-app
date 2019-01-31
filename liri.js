const dotenv = require("dotenv").config();
const keys = require("./keys");
const request = require("request");
var inquirer = require("inquirer");
var moment = require("moment");
var fs = require('fs');
var random = "";

//console.log(keys);
function start() {
	inquirer
		.prompt([
			{
				name: "command",
				message: "What would you like to do?",
				type: "list",
				choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says", "Exit"]
			}
		])
		.then(function(answers) {
			switch (answers.command) {
				case "concert-this":
					searchConcert();
					break;

				case "spotify-this-song":
					searchSpotify();
					break;

				case "movie-this":
					findMovie();
					break;

				case "do-what-it-says":
					randomFeature();
					break;

				case "Exit":
					console.log("Exiting the program");
					return;

				default:
					break;
			}
		});
}

function searchConcert() {
	inquirer
		.prompt([
			{
				name: "bandName",
				message: "Enter a name of a band?",
				type: "input"
			}
		])
		.then(function(answer) {
			let artistName = answer.bandName;
			let queryURL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";

			request(queryURL, function(error, response, body) {
				if (error) {
					console.log(error);
					return;
				}
				// parsing the return string from the API into an array of objects
				let concertDetails = JSON.parse(body);

				if (concertDetails.length === 0 || answer.bandName === "") {
					console.log("No upcoming concerts for " + answer.bandName + "\n");
					start();
				} else {
					console.log("Concert Locations for " + answer.bandName);
					concertDetails.forEach(function(info) {
						let rawDate = info.datetime;
						let formatDate = moment(rawDate).format("dddd, MMMM Do YYYY, h:mm:ssa");
						console.log("\n-------------------------------");
						console.log(info.venue.name);
						console.log(info.venue.city + ", " + info.venue.country);
						console.log(formatDate);
						console.log("-------------------------------\n");
					});
					start();
				}
			});
		});
}

function findMovie() {
	inquirer
		.prompt([
			{
				name: "movieTitle",
				message: "Enter a name of a movie you want to find?",
				type: "input"
			}
		])
		.then(function(answers) {
			var movieTitle;
			if (answers.movieTitle === "") {
				movieTitle = "Mr.Nobody";
			} else {
				movieTitle = answers.movieTitle;
			}

			let queryURL = "http://www.omdbapi.com/?t=" + movieTitle + "&apikey=trilogy";

			request(queryURL, function(error, response, body) {
				if (error) {
					console.log(error);
				}
				var movieDetails = JSON.parse(body);
				if (movieDetails.Error) {
					console.log("\n" + movieDetails.Error + "\n");
					start();
				} else {
					console.log("\n-------------------------------");
					console.log("Title: " + movieDetails.Title);
					console.log("Released: " + movieDetails.Year);
					console.log("IMDB Rating: " + movieDetails.imdbRating);
					//console.log(movieDetails."rottenTomatoes");
					console.log("Country: " + movieDetails.Country);
					console.log("Available Languages: " + movieDetails.Language);
					console.log("Plot: '" + movieDetails.Plot + "'");
					console.log("Actors: " + movieDetails.Actors);
					console.log("-------------------------------\n");
					start();
				}
			});
		});
}

function searchSpotify() {
	inquirer
		.prompt([
			{
				name: "songName",
				message: "What song do you want to search for?",
				type: "input"
			}
		])
		.then(function(answer) {
			var songTitle;
			if (answer.songName === "") {
                songTitle = "The Sign";
                songTitle = songTitle.replace(/\s/g, "+");
			} else {
                songTitle = answer.songName;
                console.log(songTitle);
                songTitle = songTitle.replace(/\s/g, "%20");
            }

            var options = {
				method: "POST",
                url: "https://accounts.spotify.com/api/token",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', 
                    "Authorization" : "Basic " + Buffer.from(keys.spotify.id+":"+keys.spotify.secret).toString('base64')
                },
                body : "grant_type=client_credentials"                
            };

            // first request to the spotify accounts service to recieve a valid token to use in the second request call
			request(options, function(error, response, body) {
				if (error){
                    console.log(error);
                }
                var test = JSON.parse(body);
                // expires in 10 hours (refresh when expired)
                let accessToken = test.access_token;
                console.log(accessToken);

                var options2 = {
                    method: "GET",
                    url: "https://api.spotify.com/v1/search?q=" + songTitle + "&type=track&limit=1",
                    headers:{
                        "Authorization": `Bearer ${accessToken}`
                    }
                }

                
                console.log(options2.url);
                
                // Second call that uses the above returned access token to use when searching the API
                request(options2, function(error, response, body){
                    if(error){
                        console.log(error);
                    }
                    var songsDetails = JSON.parse(body);
                    var artists = songsDetails.tracks.items[0].artists; 
                    var songName = songsDetails.tracks.items[0].name;
                    var songPreview = new URL(songsDetails.tracks.items[0].preview_url);
                    var songAlbum = songsDetails.tracks.items[0].album.name;

                    console.log("\n-------------------------------------");
                    console.log(songName);
                    console.log(songAlbum);
                    artists.forEach(function(item){
                        console.log(item.name);   
                    });
                    console.log(songPreview.href);
                    console.log("--------------------------------------\n");
                    //console.log(body);
                    start();
                })
			});
        });
}

function randomFeature(){
    fs.readFile("random.txt", 'utf8', function(err, data){
        if(err) {
            console.log("Empty file or file doesnt exist \n"); 
            start();
        } else {
            var wordArray = data.split(",");
            // chooses a random word from the wordArray
            let ranNum = Math.floor(Math.random() * (wordArray.length - 1));
            let choosenWord = wordArray[ranNum];
            let ranNum2 = Math.floor(Math.random() * (2));

            switch(ranNum2){
                case 0:
                    searchConcert();
                    break;
                case 1:
                    searchSpotify();
                    break;
                case 2:
                    findMovie();
                    break;
                default: 
                    start();
                    break;
            }

            console.log(data);
            start();
        }

        
    })
}

start();

