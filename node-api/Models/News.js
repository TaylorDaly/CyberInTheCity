const mongoose = require('mongoose');

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
    },
    URL: {
        type: String,
    },
    createdOn: {
        type: Date,
        required: true,
        default: Date.now()
    },
    createdBy: {
        type: String,
        required: true,
        enum: ['User', 'NewsAPI']
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