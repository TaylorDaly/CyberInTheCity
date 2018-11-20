const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
    // TODO
    // Link to program's page
    // Level
    // Department
    // College
    // Description
    // Photo
    // Title
    // Available Online/Not/Both
    // Degree or Certificate dropdown
});

const education = module.exports = mongoose.model('Program', ProgramSchema);
