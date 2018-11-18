const express = require('express');
const PublicationRouter = express.Router();
const Publication = require('../models/Publication');


// Get all publications
PublicationRouter.get('/', (req, res) => {
    Publication.getAllPublications((err, publication) => {
        if (err) {
            res.json({
                success: false, message: `Failed to get all publications.\n
            Error: ${err}`
            })
        }
        else {
            res.json({success: true, publication: publication})
        }
    })
});

//Get all publications given a person's ID (probably don't need get single publication)
PublicationRouter.get('/:ownerID', (req, res) => {
    Publication.getOwnerPublication(req.params.ownerID, (err, publication) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to get person's publication failed. Error: ${err}`
            })
        }
        else if (publication) {
            res.json(publication)
        }
        else {
            res.status(404).send({
                success: false,
                message: `404: Person's publication does not exist.`
            })
        }
    })
});

// Add
PublicationRouter.post('/', (req, res, next) => {
    let newPublication = new Publication({
        title: req.body.title,
        conference: req.body.conference,
        journal: req.body.journal,
        year: req.body.year,
        authors: req.body.authors,
        ownerID: req.body.ownerID,
        google_scholar_link: req.body.google_scholar_link,
    });

    Publication.addPublication(newPublication, (err, callback) => {
        if (err) {
            res.json({
                success: false, message: `Failed to add new publication.\n
            Error: ${err}`
            })
        }
        else {
            res.json({success: true, message: "Successfully added publication."})
        }
    })

});

// Update
PublicationRouter.put('/', (req, res, next) => {
    Publication.getPublication(req.body._id, (err, publication) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to get publication failed. Error: ${err}`
            })
        }
        else if (publication) {
            if (req.body.title) publication.title = req.body.title;
            if (req.body.conference) publication.conference = req.body.conference;
            if (req.body.journal) publication.journal = req.body.journal;
            if (req.body.year) publication.year = req.body.year;
            if (req.body.authors) publication.authors = req.body.authors;
            if (req.body.ownerID) publication.ownerID = req.body.ownerID;
            if (req.body.google_scholar_link) publication.google_scholar_link = req.body.google_scholar_link;

            Publication.updatePublication(req.body._id, publication, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: `Attempt to update publication failed. Error: ${err}`
                    })
                }
                else {
                    res.json({
                        success: true,
                        message: `Update Successful.`,
                        publication: publication
                    })
                }
            });
        }
        else {
            res.status(404).send({
                success: false,
                message: `404: Publication does not exist.`
            })
        }
    });
});

// Delete
PublicationRouter.delete('/:id', (req, res, next) => {
    Publication.getPublication(req.params.id, (err, publication) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to find publication failed. Error: ${err}`
            })
        }
        else if (publication) {
            Publication.deletePublication(publication, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: `Attempt to delete publication failed. Error: ${err}`
                    })
                }
                else {
                    res.json({
                        success: true,
                        message: `publication deleted successfully.`
                    })
                }
            });
        }
        else {
            res.status(404).send({
                success: false,
                message: `404: publication does not exist.`
            })
        }
    })
});

module.exports = PublicationRouter;