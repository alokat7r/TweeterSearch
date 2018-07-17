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
        let id = 1019316882984366100,
            arrayTemp = new Array(
                '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
                '16', '17', '18', '19', '20'
            ),
            arrayTweet = new Array();
        async.eachSeries(arrayTemp, (element, callback) => {
            console.log("ID", id, element);
            client.get('search/tweets', {
                q: req.query.keyword,
                count: 100,
                result_type: "recent",
                max_id: id
            }, function(error, tweets, response) {
                //console.log("Tweeter", tweets);
                tweets.statuses.forEach(function(tweet, index) {
                    id = tweet.id;
                    let jsonTweet = {
                        "lang": tweet.lang + "\n",
                        "text": tweet.text + "\n",
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
            jsonToFile(arrayTweet).then((result) => {
                res.json(result);
            }).catch((err) => {
                next(err);
            });
        });
    },
};

async function jsonToFile(jsonTweet) {
    return await
    new Promise((resolve, reject) => {
        let xls = json2xls(jsonTweet);
        fs.writeFile('data_' + Date.now() + '.xlsx', xls, 'binary', (err) => {
            if (err) return reject(err);
            resolve(jsonTweet);
        });
    });
}