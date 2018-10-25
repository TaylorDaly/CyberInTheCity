const mongoose = require('mongoose');
const link = require('./Link');
const image = require('./Image');

const PersonSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Teacher', 'Graduate Student', 'Undergraduate Student', 'Assistant Professor',
            'Teacher\'s Assistant', 'Other']
    },
    photo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Image'
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone_number: {
        type: String,
        required: false
    },
    office_location: {
        type: String,
        required: false
    },
    links: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Link'
    },
    google_scholar_link: {
        type: mongoose.Schema.ObjectId,
        ref: 'Link'
    }
    // Google_Scholar_link
    // LinkedIn link
    // Website

});

module.exports = mongoose.model('Person', PersonSchema);

module.exports.getAllPeople = (callback) => {
    PersonSchema.find(callback);
};

module.exports.addPerson = (newPerson, callback) => {
    newPerson.save(callback);
};