const mongoose = require('mongoose');

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
        type: mongoose.Schema.Types.Object,
        ref: 'Link'
    },
    // TODO: figure out how file upload works for pdf, may have to create separate schema with functions. I would
    // like to have a progress bar for file uploads.
    file_upload: Buffer
});

const publication = module.exports = mongoose.model('Publication', PublicationSchema);

module.exports.getAllPublications = (callback) => {
    publication.find(callback);
};

module.exports.getOwnerPublication = (ownerID, callback) => {
    let query = {ownerID: ownerID};
    publication.find(query, callback);
};

module.exports.getPublication = (id, callback) => {
    let query = {_id: id};
    publication.findOne(query, callback);
};

module.exports.addPublication = (newPublication, callback) => {
    newPublication.save(callback);
};

module.exports.updatePublication = (id, update, callback) => {
    publication.findByIdAndUpdate(id, update, callback);
};

module.exports.deletePublication = (id, callback) => {
    let query = {_id: id};
    publication.findOneAndDelete(query, callback)
};