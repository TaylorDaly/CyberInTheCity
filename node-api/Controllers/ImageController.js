// Dependencies
const express = require('express');
const ImageRouter = express.Router();
const Image = require('../models/Image');
const fs = require('fs');

ImageRouter.get('/:id', (req, res) => {
    Image.findImage(req.params.id, (err, image) => {
        if (err) {
            res.send({
                success: false,
                message: `Failed to find image. Error: ${err}`
            })
        } else if (image) {
            res.contentType(image.content_type);
            res.send(image.data)
        } else {
            res.send({
                success: false,
                message: `Image does not exist.`
            })
        }
    })
});

// TODO: implement progress percentage when saving image.
ImageRouter.post('/', (req, res) => {
    let data = fs.readFileSync(req.body.file);
    let newPic = new Image({
        data: data,
        content_type: req.body.content_type
    });

    Image.saveImage(newPic, (err, img) => {
        if (err) {
            res.json({
                success: false,
                message: `Failed to save image. Error: ${err}`
            })
        } else {
            res.json({
                success: true,
                message: `Image saved successfully.`,
                image: newPic,
                path: `http://localhost:${process.env.NODE_PORT}/image/${img._id}`
            })
        }
    });
});

ImageRouter.delete('/:id', (req, res) => {
    Image.findImage(req.params.id, (err, image) => {
        if (err) {
            res.send({
                success: false,
                message: `Failed to find image. Error: ${err}`
            })
        } else if (image) {
            Image.deleteImage(image._id, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: `Delete image failed. Error: ${err}`
                    })
                } else {
                    res.json({success: true, message: `Image deleted successfully.`});
                }
            });
        } else {
            res.send({
                success: false,
                message: `Image does not exist.`
            })
        }
    })


});

module.exports = ImageRouter;