const dotenv = require("dotenv").config();
const keys = require("../keys");
const request = require("request");
var inquirer = require("inquirer");
var start = require('../liri');

module.exports = function searchSpotify() {
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
                //console.log(songTitle);
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

                var options2 = {
                    method: "GET",
                    url: "https://api.spotify.com/v1/search?q=" + songTitle + "&type=track&limit=1",
                    headers:{
                        "Authorization": `Bearer ${accessToken}`
                    }
                }
                
                // Second call that uses the above returned access token to use when searching the API
                request(options2, function(error, response, body){
                    if(error){
                        console.log(error);
                    }
                    console.log(body);
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
                    start.startFunction();
                })
			});
        });
}