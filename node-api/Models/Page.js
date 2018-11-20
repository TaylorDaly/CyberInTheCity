const mongoose = require('mongoose');

// Allow admin to edit pages and create pages using a powerful text editor
const PageSchema = new mongoose.Schema({
    // TODO
    // Title
    // save html
    // Enum page tag (About, Contact, )
});

const education = module.exports = mongoose.model('Page', PageSchema);
