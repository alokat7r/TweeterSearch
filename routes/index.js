var express = require('express');
var router = express.Router();
var tweetSearch = require('../controllers').tweetSearch;

/* GET home page. */
router.get('/search/tweets', tweetSearch.search);

module.exports = router;