const mongoose = require('mongoose');

// TODO: Consider making this more generic, something like File.js so we can reuse for PDFs and Images.
const ImageSchema = new mongoose.Schema({
    data: Buffer,
    contentType: String,
});

module.exports = mongoose.model('Image', ImageSchema);

module.exports.saveImage = (newImage, callback) => {
    newImage.save(callback);
};

// TODO: Find proper save function, not sure if this is API or strictly UI but it would be nice to have a progress bar.