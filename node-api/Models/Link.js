const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
    URL: {
        type: String,
        required: true
    },
    // If we want display text to be different from the actual link.
    description: {
        type: String
    },
});

const Link = module.exports = mongoose.model('Link', LinkSchema);