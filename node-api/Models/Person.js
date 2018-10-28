const mongoose = require('mongoose');
const link = require('./Link');
const image = require('./Image');
const regex = require('../Config/Regex.js');

const PersonSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sys_role: {
        type: String,
        required: true,
        enum: ['Root Administrator', 'Graduate Student', 'Professor', 'None'],
        default: 'None'
    },
    role: {
        type: String,
        required: true,
        enum: ['Graduate Student', 'Undergraduate Student', 'Assistant Professor',
            'Teacher\'s Assistant', 'Professor']
    },
    photo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Image'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        match: regex.email
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
        ref: 'Link',
    },
    google_scholar_link: {
        type: mongoose.Schema.ObjectId,
        ref: 'Link'
    }
    // Google_Scholar_link
    // LinkedIn link
    // Website
});

const person = module.exports = mongoose.model('Person', PersonSchema);

module.exports.getAllPeople = (callback) => {
    person.find(callback);
};

module.exports.addPerson = (newPerson, callback) => {
    newPerson.save(callback);
};

// TODO: Get single person, delete, update