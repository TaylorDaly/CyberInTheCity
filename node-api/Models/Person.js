const mongoose = require('mongoose');
const link = require('./Link');
const image = require('./Image');
const regex = require('../Config/Regex.js');

const PersonSchema = mongoose.Schema({
    // Person must have a name, not matching to any regex because we should support international names.
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    // TODO: consider security on this: who can change a sys_role and when
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
        type: mongoose.Schema.Types.Object,
        ref: 'Image'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
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
        type: [mongoose.Schema.Types.Object],
        ref: 'Link'
    },
    google_scholar_link: {
        type: mongoose.Schema.Types.Object,
        ref: 'Link'
    }
    // Google_Scholar_link
    // LinkedIn link
    // Website
});


const person = module.exports = mongoose.model('Person', PersonSchema);

module.exports.getAllPeople = (callback) => {
    person.find(callback)
};

module.exports.addPerson = (newPerson, callback) => {
    newPerson.save(callback);
};

module.exports.getPerson = (id, callback) => {
    let query = {_id: id};
    person.findOne(query, callback)
};

module.exports.deletePerson = (id, callback) => {
    let query = {_id: id};
    person.findOneAndDelete(query, callback)
};

module.exports.updatePerson = (id, update, callback) => {
    person.findOneAndUpdate(id, update, callback)
};
