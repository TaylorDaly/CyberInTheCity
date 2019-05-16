const mongoose = require('mongoose');

const ResearchSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    // Array so we can have multiple people tied to this object.
    ownerID: {
        type: [String],
        required: true
    },
    type: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: Date,
    summary: String,
    description: String,
    // TODO: Photo
    // Internal collaborators (personIds)
    // External collaborators (list of names with link)
});

const research = module.exports = mongoose.model('Research', ResearchSchema);

module.exports.getAllResearches = (callback) => {
    research.find(callback);
};

module.exports.getOwnerResearch = (ownerID, callback) => {
    let query = {ownerID: ownerID};
    research.find(query, callback);
};

module.exports.getResearch = (id, callback) => {
    let query = {_id: id};
    research.findOne(query, callback);
};

module.exports.addResearch = (newResearch, callback) => {
    newResearch.save(callback);
};

module.exports.updateResearch = (id, update, callback) => {
    research.findByIdAndUpdate(id, update, callback);
};

module.exports.deleteResearch = (id, callback) => {
    let query = {_id: id};
    research.findOneAndDelete(query, callback)
};