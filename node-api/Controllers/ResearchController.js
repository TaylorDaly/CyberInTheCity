const express = require('express');
const ResearchRouter = express.Router();
const Research = require('../models/Research');
const Auth = require('../Config/AuthController');

// Get all researches
ResearchRouter.get('/', (req, res) => {
    Research.getAllResearches((err, research) => {
        if (err) {
            res.json({
                success: false, message: `Failed to get all researches.\n
            Error: ${err}`
            })
        } else {
            //res.json({success: true, research: research})
            res.json(research)
        }
    })
});

//Get all researches given a person's ID (probably don't need get single research)
ResearchRouter.get('/:ownerID', (req, res) => {
    Research.getOwnerResearch(req.params.ownerID, (err, research) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to get a person's research failed. Error: ${err}`
            })
        } else if (research) {
            res.json(research)
        } else {
            res.status(404).send({
                success: false,
                message: `404: Person's research does not exist.`
            })
        }
    })
});

// Add
ResearchRouter.post('/', Auth.Verify, (req, res, next) => {
    let newResearch = new Research({
        title: req.body.title,
        ownerID: req.body.ownerID,
        type: req.body.type,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        description: req.body.description
    });

    Research.addResearch(newResearch, (err, callback) => {
        if (err) {
            res.json({
                success: false, message: `Failed to add new research.\n
            Error: ${err}`
            })
        } else {
            res.json({success: true, message: "Successfully added research.", research: newResearch});
        }
    })

});

// Update
ResearchRouter.put('/', Auth.Verify, (req, res, next) => {
    Research.getResearch(req.body._id, (err, research) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to get research failed. Error: ${err}`
            })
        } else if (research) {
            if (req.body.title) research.title = req.body.title;
            if (req.body.ownerID) research.ownerID = req.body.ownerID;
            if (req.body.type) research.type = req.body.type;
            if (req.body.startDate) research.startDate = req.body.startDate;
            if (req.body.endDate) research.endDate = req.body.endDate;
            if (req.body.description) research.description = req.body.description;

            Research.updateResearch(req.body._id, research, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: `Attempt to update research failed. Error: ${err}`
                    })
                } else {
                    res.json({
                        success: true,
                        message: `Update Successful.`,
                        research: research
                    })
                }
            });
        } else {
            res.status(404).send({
                success: false,
                message: `404: Research does not exist.`
            })
        }
    });
});

// Delete
ResearchRouter.delete('/:id', Auth.Verify, (req, res, next) => {
    Research.getResearch(req.params.id, (err, research) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to find research failed. Error: ${err}`
            })
        } else if (research) {
            Research.deleteResearch(research, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: `Attempt to delete research failed. Error: ${err}`
                    })
                } else {
                    res.json({
                        success: true,
                        message: `Research deleted successfully.`
                    })
                }
            });
        } else {
            res.status(404).send({
                success: false,
                message: `404: Research does not exist.`
            })
        }
    })
});

module.exports = ResearchRouter;