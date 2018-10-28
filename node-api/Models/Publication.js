const mongoose = require('mongoose');
const link = require('./Link');

const PublicationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    conference: String,
    journal: String,
    year: Date,
    authors: [String],
    ownerID: {
        type: String,
        required: true
    },
    google_scholar_link: {
        type: mongoose.Schema.ObjectId,
        ref: 'Link'
    },
    // TODO: figure out how file upload works for pdf, may have to create separate schema with functions. I would
    // like to have a progress bar for file uploads.
    file_upload: Buffer
});

const publication = module.exports = mongoose.model('Publication', PublicationSchema);