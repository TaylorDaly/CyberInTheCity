const mongoose = require('mongoose');
const regex = require('../Config/Regex.js');

// TODO: add NewsAPI Attribution link on front page
//  powered by NewsAPI.org
const NewsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    imageLink: {
        type: String,
        match: regex.link
    },
    createdOn: {
        type: Date,
        required: true,
        default: Date.now()
    }
});


const news = module.exports = mongoose.model('News', NewsSchema);

module.exports.deleteNews = (newsToDelete, callback) => {
    newsToDelete.remove(callback);
};

module.exports.getNews = (query, callback) => {
    news.find(query, callback)
};

module.exports.addNews = (newNews, callback) => {
    newNews.save(callback);
};