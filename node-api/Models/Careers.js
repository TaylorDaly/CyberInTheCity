const mongoose = require('mongoose');

const CareersSchema = new mongoose.Schema({
    jobtitle: {
        type: String,
        required: true
    },
    company: String,
    jobType: {
        type: String,
        enum: ['FullTime', 'Internship']
    },
    url: String,
    location: String,
    postedDate: Date,
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
    careers.findByIdAndUpdate(id, update, callback);
};

module.exports.deleteCareer = (id, callback) => {
    let query = {_id: id};
    careers.deleteOne(query, callback)
};