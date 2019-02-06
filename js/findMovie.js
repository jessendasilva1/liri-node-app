var inquirer = require("inquirer");
const request = require("request");
var start = require('../liri');

module.exports = function findMovie(){
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
					start.startFunction();
				}
			});
		});   
}
