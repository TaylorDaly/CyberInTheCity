const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
    // Link to program's page
    link: String,
    // Level
    level: String,
    // Department
    department: String,
    // College
    college: String,
    // Description
    description: String,
    // Photo
    photo: String,
    // Title
    title: String,
    //TODO will this be an enum?
    // Available Online/Not/Both
    available: {
        type: String,
        enum: ['Online', 'Not', 'Both']
    },
    // Degree or Certificate drop down
    degree: String
});

const program = module.exports = mongoose.model('Program', ProgramSchema);

module.exports.getAllPrograms = (callback) => {
    program.find(callback);
};

module.exports.getProgram = (id, callback) => {
    let query = {_id: id};
    program.findOne(query, callback);
};

module.exports.addProgram = (newPrograms, callback) => {
    newPrograms.save(callback);
};

module.exports.updateProgram = (id, update, callback) => {
    program.findOneAndUpdate(id, update, callback);
};

module.exports.deleteProgram = (id, callback) => {
    let query = {_id: id};
    program.findOneAndDelete(query, callback)
};