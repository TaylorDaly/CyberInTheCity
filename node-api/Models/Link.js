const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
    URL: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: false
    }
});

module.exports(mongoose.model('Link', LinkSchema));