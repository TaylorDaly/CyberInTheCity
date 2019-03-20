const express = require('express');
const PageRouter = express.Router();
const Page = require('../Models/Page');
const Auth = require('../Config/AuthController');

PageRouter.get('/', (req, res) => {
    let query = {};
    if (req.query._id) query['_id'] = req.query._id;
    if (req.query.title) query['title'] = req.query.title;

    if (JSON.stringify(query) !== '{}') {
        Page.findOne(query, 'title content parent', (err, page) => {
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
                    message: `Page "${req.query.title}" does not exist.`
                })
            }
        })
    } else {
        Page.getAllPages((err, pages) => {
            if (err) {
                res.status(500).json({
                    success: false, message: `Failed to get all pages. Error: ${err}`
                })
            } else {
                res.json(pages)
            }
        })
    }
});

PageRouter.post('/', Auth.VerifySysAdmin, (req, res, next) => {
    let newPage = new Page({
        title: req.body.title,
        content: req.body.content,
        parent: req.body.parent
    });

    Page.addPage(newPage, (err) => {
        if (err) {
            next(err);
        } else {
            res.json({ success: true, message: `Page successfully created` })
        }
    });
});

PageRouter.put('/', Auth.VerifySysAdmin, (req, res, next) => {
    Page.getOne({ _id: req.body._id }, (err, page) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: `Failed to get all pages. Error: ${err}`
            })
        } else if (page) {
            if (req.body.title) page.title = req.body.title;
            if (req.body.content) page.content = req.body.content;
            if (req.body.parent) page.parent = req.body.parent;
            Page.updatePage(page._id, page, (err) => {
                if (err) {
                    res.status(500).json({ success: false, message: `Failed to update page. Error: ${err}` })
                } else {
                    res.json({ success: true, message: `Update successful.`, page: page });
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

PageRouter.delete('/:id', Auth.VerifySysAdmin, (req, res) => {
    Page.getOne({ _id: req.params.id }, (err, page) => {
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
