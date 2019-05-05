const dbConfig = require('../Config/Database');
const NewsAPI = new (require('newsapi'))(dbConfig.newsKey);
const NewsRouter = require('express').Router();
const News = require('../Models/News');
const schedule = require('node-schedule');
const Auth = require('../Config/AuthController');
const path = require('path');
const fs = require('fs');

// Gets 10 news sources with created on date less than the passed 'createdOnBefore'. For pagination follow up
// requests need to get the 10th created on date and pass that as the new 'createdOnBefore' so that articles are
// returned sequentially based on date.
NewsRouter.get('/', (req, res, next) => {
    let queryDate = new Date(req.query.createdOnBefore);
    News.find({ createdOn: { $lt: queryDate } })
        .limit(10)
        .sort('-createdOn')
        .exec((err, items) => {
            err ? next(err) : res.json(items);
        });
});

// Download file with news key words used to filter in python script //
NewsRouter.get('/getKeywords', Auth.VerifySysAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../Python', 'Test.txt'));
});

NewsRouter.post('/', Auth.VerifySysAdmin, (req, res, next) => {
    fs.writeFile(path.join(__dirname, '../Python', 'Test.txt'), req.body.keywords, function(err) {
        if (err) {
            res.json({
                success: false, message: `Failed to update news keywords.\n
            Error: ${err}`
            })
        } else {
            res.json({success: true, message: "Successfully updated news keywords."})
        }
    });
});

// Scheduled job to find news and add it to our own database every day at midnight.
// Collects the last 24 hours of articles every 24 hours.
schedule.scheduleJob('0 0 * * *', () => {
    // 1. Hit News API
    // https://newsapi.org/docs/client-libraries/node-js

    // Today and 24 hours ago in ISO 8601 format (yyyy-mm-dd). The NewsAPI requires this format.
    let today = new Date().toISOString();
    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString();
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
            // Null checks
            for (let i = 0; i < response.articles.length; i++) {
                if (!response.articles[i].content || !(response.articles[i].content.length > 250) ||
                    !response.articles[i].urlToImage || !response.articles[i].title || !response.articles[i].url ||
                    !response.articles[i].source.name) {
                    response.articles.splice(i, 1);
                }
            }
            // Remove articles with missing content.
            console.log(`[${new Date()}] : Running learning script on ${response.articles.length} news articles.`);
            //   a. Send articles to machine learning script.
            runPy(JSON.stringify(response)).then(async (learnedNews) => {
                //    b. get response and save it.
                try {
                    await addArticleArray(JSON.parse(learnedNews));
                    if ((JSON.parse(learnedNews).articles.length) !== 0) console.log(`[${new Date()}] : Successfully added ${(JSON.parse(learnedNews).articles.length)} news article(s).`);
                    else console.log(`[${new Date()}] : Found 0 suitable articles.`)
                } catch (err) {
                    console.log(`[${new Date()}] : ${err}`)
                }
            }).catch(err => {
                console.log(`[${new Date()}] : ${err}`)
            });
        } else {
            console.log('NewsAPI returned 0 articles.')
        }
    }).catch(err => {
        console.log(`[${new Date()}] : ${err}`)
    });
});

const addArticleArray = async (learnedNews) => {
    for (const article of learnedNews.articles) {
        let newNews = new News({
            title: article.title,
            URL: article.url,
            content: article.content,
            imageLink: article.urlToImage,
            createdBy: 'NewsAPI',
            source: article.source.name
        });

        // Removes the [+1234 chars] at the end of content string.
        newNews.content = newNews.content.split('… [')[0] + '...';

        // 3. Save News
        try {
            await newNews.save((err) => {
                if (err) {
                    if (err.code === 11000 && err.name === 'MongoError') {
                        // Do nothing if news already exists. Duplicate error will be based on
                    } else {
                        throw new Error(err)
                    }
                }
            });
        } catch (err) {
            throw new Error(err);
        }
    }
};

const runPy = async (news) => {
    return new Promise((resolve, reject) => {
        const { spawn } = require('child_process');
        const pyprog = spawn('python', ['./Python/LearnNewsScript.py', news]);

        pyprog.stdout.on('data', (data) => {
            resolve(data.toString('utf-8'));
        });

        pyprog.stderr.on('data', (data) => {
            console.log('[' + new Date() + ']' + ` : Python error happened during News Learning script. Error: ${data.toString()}`);
            reject(new Error(data.toString('utf-8')));
        });
    });
};

module.exports = NewsRouter;
