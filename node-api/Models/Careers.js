const mongoose = require('mongoose');

const CareersSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    ownerID: {
        type: [String],
        required: true
    },
    hours: {
        type: String,
        enum: ['Part-Time', 'Full-Time', 'Internship']
    },
    location: String,
    deadlineDate: Date,
    description: String,
});

const careers = module.exports = mongoose.model('Careers', CareersSchema);

module.exports.getAllCareers = (callback) => {
    careers.find(callback);
};

module.exports.getOwnerCareer = (ownerID, callback) => {
    let query = {ownerID: ownerID};
    careers.find(query, callback);
};

module.exports.getCareer = (id, callback) => {
    let query = {_id: id};
    careers.findOne(query, callback);
};

module.exports.addCareer = (newCareers, callback) => {
    newCareers.save(callback);
};

module.exports.updateCareer = (id, update, callback) => {
    careers.findOneAndUpdate(id, update, callback);
};

module.exports.deleteCareer = (id, callback) => {
    let query = {_id: id};
    careers.findOneAndDelete(query, callback)
};