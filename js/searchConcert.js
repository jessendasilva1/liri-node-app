var inquirer = require("inquirer");
const request = require("request");
var moment = require("moment");
var start = require('../liri');

module.exports = function searchConcert() {
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
					start.startFunction();
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
					start.startFunction();
				}
			});
		});
}