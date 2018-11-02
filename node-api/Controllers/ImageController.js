// Dependencies
const express = require('express');
const ImageRouter = express.Router();
const Link = require('../models/Link');
const Image = require('../models/Image');
const fs = require('fs');

ImageRouter.post('/', (req, res) => {
    let stream = fs.createReadStream(req.path);
    let buffer = stream.open();
    let newPic = new Image({
        buffer: buffer,
        content_type: buffer.type
    });

    Image.saveImage(newPic, (err) => {
       if (err){
           res.json({
               success: false,
               message: `Failed to save image.`
           })
       }
    });

    res.json({
        success: true,
        message: `Image Saved Successfully.`
    })
});

ImageRouter.delete('/:id', (req, res) => {
    let stream = fs.createReadStream(req.path);
    let buffer = stream.open();
    let newPic = new Image({
        buffer: buffer,
        content_type: buffer.type
    });
});

module.exports = ImageRouter;