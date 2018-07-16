const request = require('request');
const dotenv = require('dotenv');
var Twitter = require('twitter');
dotenv.config();
module.exports = {
    search(req, res, next) {
        console.log("Param", req.query.keyword);
        var client = new Twitter({
            consumer_key: process.env.twitter_consumer_key,
            consumer_secret: process.env.twitter_consumer_secret,
            bearer_token: process.env.twitter_bearer_token
        });

        client.get('search/tweets', {
            q: req.query.keyword,
            count: 100
        }, function(error, tweets, response) {
            tweets.statuses.forEach(function(tweet) {
                console.log("tweet: " + tweet.text);
            });
            res.json(tweets);
        });

    },
}