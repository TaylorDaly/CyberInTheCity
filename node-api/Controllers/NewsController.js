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
NewsRouter.post('/', (req, res, next) => {
    // 1. Hit News API
    // https://newsapi.org/docs/client-libraries/node-js

    // Today and 24 hours ago in ISO 8601 format.
    let today = new Date().toISOString();
    let yesterday = new Date(new Date().setDate(new Date().getDate()-1)).toISOString();

    NewsAPI.v2.everything({
        q: 'cybersecurity',
        from: yesterday,
        to: today,
        language: 'en',
        page: 1,
        pageSize: 30
    }).then(response => {
        // 2. Find Relevant News
        if (response.articles.length > 0) {
            //   a. Send to machine learning script
            runPy(JSON.stringify(response)).then((learnedNews) => {
                //    b. get response
                res.json(JSON.parse(learnedNews));
                // TODO 3. Save News
            }, (err) => {
                next(err)
            }).catch(err => {
                next(err)
            });
        } else {
            res.json({success: false, message: 'NewsAPI returned 0 articles.'})
        }
    }).catch(err => {
        next(err)
    });
});


const runPy = (news) => {
    return new Promise((success, error) => {

        const {spawn} = require('child_process');
        const pyprog = spawn('python', ['./Python/LearnNewsScript.py', news]);

        pyprog.stdout.on('data', (data) => {
            success(data.toString('utf-8'));
        });

        pyprog.stderr.on('data', (data) => {
            console.log('[' + new Date() + ']' + ` : News Learn script broke. Error: ${data.toString()}`);
            error(new Error(data.toString('utf-8')));
        });
    });
};

module.exports = NewsRouter;