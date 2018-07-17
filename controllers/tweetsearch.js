const request = require('request');
const dotenv = require('dotenv');
const Twitter = require('twitter');
const json2xls = require('json2xls');
const fs = require('fs');
const async = require('async');
dotenv.config();
module.exports = {
    search(req, res, next) {
        console.log("Param", req.query.keyword);
        var client = new Twitter({
            consumer_key: process.env.twitter_consumer_key,
            consumer_secret: process.env.twitter_consumer_secret,
            bearer_token: process.env.twitter_bearer_token
        });

        let id = 1019322160945364992, //Since July 18/18 03:05AM
            arrayTemp = new Array(70),
            arrayTweet = new Array();
        async.eachSeries(arrayTemp, (element, callback) => {
            console.log("ID", id, element);
            client.get('search/tweets', {
                q: req.query.keyword,
                count: 100,
                max_id: id,
                tweet_mode: "extended"
            }, function(error, tweets, response) {
                //console.log("Tweeter", tweets);
                tweets.statuses.forEach(function(tweet, index) {
                    id = tweet.id;
                    let jsonTweet = {
                        "lang": tweet.lang + "\n",
                        "text": tweet.full_text + "\n",
                        "created_at": tweet.created_at + "\n",
                        "id": tweet.id + "\n"
                    }
                    arrayTweet.push(jsonTweet);
                });
                callback();
            });
        }, (err) => {
            if (err) {
                return next(err);
            }
            jsonToFile(arrayTweet, req.query.keyword).then((result) => {
                res.json(result);
            }).catch((err) => {
                next(err);
            });
        });
    },
};

async function jsonToFile(jsonTweet, keyword) {
    return await
    new Promise((resolve, reject) => {
        let xls = json2xls(jsonTweet);
        fs.writeFile('data_' + Date.now() + keyword + '.xlsx', xls, 'binary', (err) => {
            if (err) return reject(err);
            resolve(jsonTweet);
        });
    });
}