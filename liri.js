const dotenv = require("dotenv").config();
const keys = require("./keys");
const request = require("request");
var inquirer = require("inquirer");
var moment = require("moment");

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
					//console.log("spotify command");
					break;

				case "movie-this":
					findMovie();
					break;

				case "do-what-it-says":
					//console.log("do what it says command");
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
		.then(function(answers) {
			let artistName = answers.bandName;
			let queryURL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";

			request(queryURL, function(error, response, body) {
				if (error) {
					console.log(error);
					return;
				}
				// parsing the return string from the API into an array of objects
				let concertDetails = JSON.parse(body);

				if (concertDetails.length === 0 || answers.bandName === "") {
					console.log("No upcoming concerts for " + answers.bandName + "\n");
					start();
				} else {
					console.log("Concert Locations for " + answers.bandName);
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

start();
