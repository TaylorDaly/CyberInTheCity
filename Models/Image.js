const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    buffer: {
        type: String,
        required: true
    },
    content_type: {
        type: String,
        required: true,
        enum: ['image/jpeg', 'image/png']
    },
});

const Image = module.exports = mongoose.model('Image', ImageSchema);

module.exports.saveImage = (newImage, callback) => {
    newImage.save(callback);
};

module.exports.deleteImage = (id, callback) => {
    let query = {_id: id};
    Image.findOneAndDelete(query, callback)
};

module.exports.findImage = (id, callback) => {
    let query = {_id: id};
    Image.findOne(query, callback);
};
