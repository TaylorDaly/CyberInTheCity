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
        match: regex.phone
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
        type: String,
        minlength: 4
    },
    my_website_link: {
        type: String,
        minlength: 4
    },
    google_drive_link: {
        type: String,
        minlength: 33
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    }
    // Website
});

// Remove photo before deleting person
PersonSchema.pre('remove', function (next) {
    if (this.photo) {
        this.model('Image').remove({_id: this.photo._id}, (err) => {
            if (err) {
                next(err)
            }
        });
    }
    next();
});

// Put http in link before saving if it's not there.
PersonSchema.pre('save', async function () {
    if (this.links) this.links = await cleanLinks(this.links);
    if (this.google_scholar_link) this.google_scholar_link = (this.google_scholar_link.indexOf('://') === -1) ? 'http://' + this.google_scholar_link : this.google_scholar_link;
    if (this.google_drive_link) this.google_drive_link = (this.google_drive_link.indexOf('://') === -1) ? 'http://' + this.google_drive_link : this.google_drive_link;
    if (this.my_website_link) this.my_website_link = (this.my_website_link.indexOf('://') === -1) ? 'http://' + this.my_website_link : this.my_website_link;
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

// async function to add http:// before links
cleanLinks = async (links) => {
    return new Promise(resolve => {
        for (let i = 0; i < links.length; i++) {
            links[i].URL = (links[i].URL.indexOf('://') === -1) ? 'http://' + links[i].URL : links[i].URL;
            if (i+1 === links.length){
                resolve(links);
            }
        }
    })
};