const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
    courseNumber: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    description: String,
    category: String,
    department: String,
    termYear: String,
    Content: String,
    Syllabus: String,
});

const education = module.exports = mongoose.model('Education', EducationSchema);

module.exports.getAllEducations = (callback) => {
    education.find(callback);
};

module.exports.getEducation = (id, callback) => {
    let query = {_id: id};
    education.findOne(query, callback);
};

module.exports.addEducation = (newEducation, callback) => {
    newEducation.save(callback);
};

module.exports.updateEducation = (id, update, callback) => {
    education.findOneAndUpdate(id, update, callback);
};

module.exports.deleteEducation = (id, callback) => {
    let query = {_id: id};
    education.findOneAndDelete(query, callback)
};