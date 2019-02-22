const express = require('express');
const PageRouter = express.Router();
const Page = require('../models/Page');
const Auth = require("../Config/AuthController");

PageRouter.get('/', (req, res) => {
    Page.getAllPages((err, pages) => {
        if (err) {
            res.status(500).json({
                success: false, message: `Failed to get all pages. Error: ${err}`
            })
        } else {
            res.json(pages)
        }
    })
});

PageRouter.get('/:title', (req, res) => {
    Page.findOne({title: req.params.title}, "title content parent", (err, page) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: `Failed to get page. Error: ${err}`
            })
        } else if (page) {
            res.json(page);
        } else {
            res.status(404).json({
                success: false,
                message: `Page "${req.params.title}" does not exist.`
            })
        }
    })
});

PageRouter.post('/', Auth.Verify, (req, res, next) => {
    let newPage = new Page({
        title: req.body.title,
        content: req.body.content,
        parent: req.body.parent
    });

    Page.addPage(newPage, (err) => {
        if (err) {
            if (err.code === 11000 && err.name === 'MongoError') {
                res.status(400).json({
                    success: false,
                    message: `There is already a page with the title '${newPage.title}'`
                });
            }
            next(err);
        } else {
            res.json({success: true, message: `Page successfully created`})
        }
    });
});


PageRouter.put('/', Auth.Verify, (req, res, next) => {
    Page.getOne({title: req.body.title}, (err, page) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: `Failed to get all pages. Error: ${err}`
            })
        } else if (page) {
            page.title = req.body.title;
            page.content = req.body.content;
            page.parent = req.body.parent;
            Page.updatePage(page._id, page, (err) => {
                if (err) {
                    res.status(500).json({success: false, message: `Failed to update page. Error: ${err}`})
                } else {
                    res.json({success: true, message: `Update successful.`, page: page});
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: `Page "${req.body.title}" does not exist.`
            })
        }
    });
});

PageRouter.delete('/', Auth.Verify, (req, res) => {
    Page.getOne({_id: req.body._id}, (err, page) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: `Error when trying to find page. Error: ${err}`
            })
        } else if (page) {
            Page.removePage(page._id, (err) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: `Error when attempting to delete page: ${err}`
                    })
                } else {
                    res.json({
                        success: true,
                        message: `Delete successful.`
                    })
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: `Page does not exist.`
            })
        }
    });
});

module.exports = PageRouter;