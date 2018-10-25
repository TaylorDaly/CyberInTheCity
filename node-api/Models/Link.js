const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
    URL: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
});

const Link = module.exports = mongoose.model('Link', LinkSchema);