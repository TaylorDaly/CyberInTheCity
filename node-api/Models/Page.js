const mongoose = require('mongoose');

// Allow admin to edit pages and create pages using a powerful text editor
const PageSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    content: {type: String, required: true, select: false},
    parent: {type: String, required: true, enum: ['People', 'Education', 'Research', 'News']}
});

const page = module.exports = mongoose.model('Page', PageSchema);

module.exports.getAllPages = (callback) => {
    page.find(callback);
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