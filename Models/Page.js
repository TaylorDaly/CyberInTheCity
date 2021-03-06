const mongoose = require('mongoose');

// Allow admin to edit pages and create pages using a powerful text editor
const PageSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    content: {type: String, select: false},
    htmlString: {type: String},
    parent: {
        type: String,
        required: true,
        enum: [
            'About Us', 'People', 'Education', 'Research', 'News', 'Events',
            'Careers', 'Contact Us'
        ]
    }
});

const page = module.exports = mongoose.model('Page', PageSchema);

// Skip about us and contact us static pages.
module.exports.getAllPages = (callback) => {
    page.find({title: {$nin: ['About Us', 'Contact Us', 'Home']}}, callback).sort({'parent': 'asc'});
};

module.exports.getOne = (query, callback) => {
    page.findOne(query, callback)
};

module.exports.addPage = (newPage, callback) => {
    newPage.save(callback);
};

module.exports.updatePage = (id, update, callback) => {
    page.findByIdAndUpdate(id, update, callback);
};

module.exports.removePage = (id, callback) => {
    page.findByIdAndDelete(id, callback);
};
