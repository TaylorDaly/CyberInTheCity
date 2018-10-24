const mongoose = require('mongoose');
const link = require('./Link');

const PersonSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Role: {
        type: String,
        required: true,
        enum: ['Teacher', 'Graduate Student', 'Undergraduate Student', 'Assistant Professor',
            'Teacher\'s Assistant', 'Other']
    },
    Photo: {
        type: Blob,
        required: false
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Phone_Number: {
        type: String,
        required: false
    },
    Office_Location: {
        type: String,
        required: false
    },
    Links: [link]
    // Google_Scholar_link
    // LinkedIn link
    // Website

});

module.exports(mongoose.model('Person', PersonSchema));