const mongoose = require('mongoose');
const regex = require('../Config/Regex.js');
const Link = require('../Models/Link.js');

const PersonSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    sys_role: {
        type: String,
        required: true,
        enum: ['Sys_Admin', 'Admin', 'User'],
        default: 'User',
        select: false
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: regex.email,
        minlength: 14
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
    phone_number: {
        type: String,
        required: false,
        minlength: 10,
    },
    biography: {
        type: String,
        required: false
    },
    office_location: {
        type: String,
        required: false
    },
    links: {
        type: [mongoose.Schema.Types.Object],
        ref: Link
    },
    google_scholar_link: {
        type: mongoose.Schema.Types.Object,
        ref: Link
    },
    my_website_link: {
        type: mongoose.Schema.Types.Object,
        ref: Link
    },
    google_drive_link: {
        type: String,
        ref: Link
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    }
    // Website
});

// Remove photo before deleting person
PersonSchema.pre('remove', function(next) {
    if (this.photo) {
        this.model('Image').remove({_id: this.photo._id}, (err) => {
            if (err) {
                next(err)
            }
        });
    }
    next();
});

const person = module.exports = mongoose.model('Person', PersonSchema);

module.exports.deletePerson = (personToDelete, callback) => {
    personToDelete.remove(callback);
};

module.exports.getPeople = (query, callback) => {
    person.find(query, callback)
        .populate('photo')
};

module.exports.addPerson = (newPerson, callback) => {
    newPerson.save(callback);
};

module.exports.getPerson = (query, callback) => {
    person.findOne(query, callback)
        .populate('photo')
};

module.exports.updatePerson = (update, callback) => {
    update.save(update, callback)
};

