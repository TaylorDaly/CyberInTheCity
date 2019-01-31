const dbConfig = require('../Config/Database');
const NewsAPI = new (require('newsapi'))(dbConfig.newsKey);
const NewsRouter = require('express').Router();
const News = require('../models/News');

NewsRouter.get('/', (req, res, next) => {
    let queryDate = new Date(req.body.createdOnBefore);
    News.find({createdOn: {$lt: queryDate}})
        .limit(10)
        .sort('-createdOn')
        .exec((err, items) => {
            if (err) next(new Error('Unable to get news'));
            res.json(items);
        });
});

// Path to find news and add it to our own database
// TODO: figure out how to set a schedule on this path. Should not be able to call this path, it should get news at
//  some sort of interval i.e. daily. Maybe it shouldn't even be a path.
NewsRouter.post('/', (req, res) => {
    // 1. Hit News API
    // https://newsapi.org/docs/client-libraries/node-js
    let today = new Date();
    let todayString = today.getFullYear() + '-' + today.getMonth() + 1 + '-' + today.getDate();
    // console.log(todayString); // Format: YYYY-MM-DD

    NewsAPI.v2.everything({
        q: 'cybersecurity',
        //sources: 'bbc-news,the-verge',
        //domains: 'bbc.co.uk, techcrunch.com',
        from: todayString,
        to: todayString,
        language: 'en',
        sortBy: 'relevancy',
        page: 1
    }).then(response => {

        runPy.then(function(fromRunpy) {
            console.log(fromRunpy.toString());
            res.end(fromRunpy);
        });
        //res.send(response);
        /*
          {
            status: "ok",
            articles: [...]
          }
        */
    });
    // 2. Find Relevant News
    //      a. Send to machine learning script
    //      b. get response
    // 3. Save News
});

let runPy = new Promise(function(success, error) {

    const { spawn } = require('child_process');
    const pyprog = spawn('python', ['../Python/NewsLearn/LearnNewsScript.py']/*, params*/);

    pyprog.stdout.on('data', function(data) {

        success(data);
    });

    pyprog.stderr.on('data', (data) => {
        //TODO: error handling
        error(data);
    });
});

module.exports = NewsRouter;