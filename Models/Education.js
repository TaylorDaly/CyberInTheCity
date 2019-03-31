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
    courseSection: {
        type: String
    },
    description: String,
    department: String,
    termSemester: String,
    termYear: String,
    googleDriveLink: String,
    syllabus: String,
    teacher: String
});

const education = module.exports = mongoose.model('Education', EducationSchema);

module.exports.getAllEducations = (callback) => {
    education.find(callback);
};

module.exports.getEducation = (query, callback) => {
    education.findOne(query, callback);
};

module.exports.addEducation = (newEducation, callback) => {
    newEducation.save(callback);
};

module.exports.updateEducation = (id, update, callback) => {
    education.findByIdAndUpdate(id, update, callback);
};

module.exports.deleteEducation = (id, callback) => {
    let query = {_id: id};
    education.findOneAndDelete(query, callback)
};