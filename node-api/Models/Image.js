const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    data: {
        type: Buffer,
        required: true
    },
    content_type: {
        type: String,
        required: true,
        enum: ['image/jpg', 'image/png']
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
