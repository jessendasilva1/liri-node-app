const dotenv = require("dotenv").config();
var inquirer = require("inquirer");
//var fs = require('fs');
var findMovie = require('./js/findMovie');
var searchConcert = require('./js/searchConcert');
var searchSpotify = require('./js/searchSpotify');
//var random = "";

var startFunction = function start() {
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
					console.log("Coming soon!");
					startFunction();
					break;

				case "Exit":
					console.log("Exiting the program");
					return;

				default:
					break;
			}
		});
}

/*
function randomFeature(){
    fs.readFile("random.txt", 'utf8', function(err, data){
        if(err) {
            console.log("Empty file or file doesnt exist \n"); 
            startFunction();
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
                    startFunction();
                    break;
            }

            console.log(data);
            startFunction();
        }

        
    })
}
*/
startFunction();

exports.startFunction = startFunction;
