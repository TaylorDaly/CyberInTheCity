const mongoose = require('mongoose');

// Allow admin to edit pages and create pages using a powerful text editor
const EventSchema = new mongoose.Schema({
    // TODO
});

const event = module.exports = mongoose.model('Page', EventSchema);
