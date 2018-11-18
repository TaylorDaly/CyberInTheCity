const mongoose = require('mongoose');

const ResearchLabSchema = new mongoose.Schema({
    labName: {
        type: String,
        required: true
    },
    labTitle: {
        type: String,
        required: true
    },
    image: String,
    description: String,
    location: String,
    ownerID: {
        type: String,
        required: true
    },
});

const researchLab = module.exports = mongoose.model('ResearchLab', ResearchLabSchema);

module.exports.getAllResearchLabs = (callback) => {
    researchLab.find(callback);
};

module.exports.getOwnerResearchLab = (ownerID, callback) => {
    let query = {ownerID: ownerID};
    researchLab.find(query, callback);
};

module.exports.getResearchLab = (id, callback) => {
    let query = {_id: id};
    researchLab.findOne(query, callback);
};

module.exports.addResearchLab = (newResearchLab, callback) => {
    newResearchLab.save(callback);
};

module.exports.updateResearchLab = (id, update, callback) => {
    researchLab.findOneAndUpdate(id, update, callback);
};

module.exports.deleteResearchLab = (id, callback) => {
    let query = {_id: id};
    researchLab.findOneAndDelete(query, callback)
};