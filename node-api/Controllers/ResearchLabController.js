const express = require('express');
const ResearchLabRouter = express.Router();
const ResearchLab = require('../models/ResearchLab');



// Get all researchLabs
ResearchLabRouter.get('/', (req, res) => {
    ResearchLab.getAllResearchLabs((err, researchLab) => {
        if (err) {
            res.json({
                success: false, message: `Failed to get all researchLabs.\n
            Error: ${err}`
            })
        }
        else {
            res.json({success: true, research: researchLab})
        }
    })
});

//Get all researchLabs given a person's ID (probably don't need get single researchLab)
ResearchLabRouter.get('/:ownerID', (req, res) => {
    ResearchLab.getOwnerResearchLab(req.params.ownerID, (err, researchLab) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to get a person's researchLab failed. Error: ${err}`
            })
        }
        else if (researchLab) {
            res.json(researchLab)
        }
        else {
            res.status(404).send({
                success: false,
                message: `404: Person's researchLab does not exist.`
            })
        }
    })
});

// Add
ResearchLabRouter.post('/', (req, res, next) => {
    let newResearchLab = new ResearchLab({
        labName: req.body.labName,
        labTitle: req.body.labTitle,
        image: req.body.image,
        description: req.body.description,
        location: req.body.location,
        ownerID: req.body.ownerID
    });

    ResearchLab.addResearchLab(newResearchLab, (err, callback) => {
        if (err) {
            res.json({
                success: false, message: `Failed to add new researchLab.\n
            Error: ${err}`
            })
        }
        else {
            res.json({success: true, message: "Successfully added researchLab."})
        }
    })

});

// Update
ResearchLabRouter.put('/', (req, res, next) => {
    ResearchLab.getResearchLab(req.body._id, (err, researchLab) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to get researchLab failed. Error: ${err}`
            })
        }
        else if (researchLab) {
            if (req.body.labName) researchLab.labName = req.body.labName;
            if (req.body.labTitle) researchLab.labTitle = req.body.labTitle;
            if (req.body.image) researchLab.image = req.body.image;
            if (req.body.description) researchLab.description = req.body.description;
            if (req.body.location) researchLab.location = req.body.location;
            if (req.body.ownerID) researchLab.ownerID = req.body.ownerID;

            ResearchLab.updateResearchLab(req.body._id, researchLab, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: `Attempt to update researchLab failed. Error: ${err}`
                    })
                }
                else {
                    res.json({
                        success: true,
                        message: `Update Successful.`,
                        researchLab: researchLab
                    })
                }
            });
        }
        else {
            res.status(404).send({
                success: false,
                message: `404: ResearchLab does not exist.`
            })
        }
    });
});
ResearchLabRouter.delete('/:id', (req, res, next) => {
    ResearchLab.getResearchLab(req.params.id, (err, researchLab) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to find researchLab failed. Error: ${err}`
            })
        }
        else if (researchLab) {
            ResearchLab.deleteResearchLab(researchLab, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: `Attempt to delete researchLab failed. Error: ${err}`
                    })
                }
                else {
                    res.json({
                        success: true,
                        message: `ResearchLab deleted successfully.`
                    })
                }
            });
        }
        else {
            res.status(404).send({
                success: false,
                message: `404: ResearchLab does not exist.`
            })
        }
    })
});

module.exports = ResearchLabRouter;