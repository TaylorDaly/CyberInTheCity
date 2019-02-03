const express = require('express');
const CareersRouter = express.Router();
const Careers = require('../models/Careers');
const Auth = require('../Config/Auth');

// Get all careers
CareersRouter.get('/', (req, res) => {
    Careers.getAllCareers((err, careers) => {
        if (err) {
            res.json({
                success: false, message: `Failed to get all careers.\n
            Error: ${err}`
            })
        } else {
            //res.json({success: true, careers: careers})
            res.json(careers)
        }
    })
});

//Get all careers given the owners ID (HandShake or professor)
CareersRouter.get('/:ownerID', (req, res) => {
    Careers.getOwnerCareer(req.params.ownerID, (err, careers) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to get an owners careers failed. Error: ${err}`
            })
        } else if (careers) {
            res.json(careers)
        } else {
            res.status(404).send({
                success: false,
                message: `404: Owner's careers does not exist.`
            })
        }
    })
});

// Add
CareersRouter.post('/', Auth.Verify, (req, res, next) => {
    let newCareers = new Careers({
        title: req.body.title,
        ownerID: req.body.ownerID,
        hours: req.body.hours,
        link: req.body.link,
        location: req.body.location,
        deadlineDate: req.body.deadlineDate,
        description: req.body.description
    });

    Careers.addCareer(newCareers, (err, callback) => {
        if (err) {
            res.json({
                success: false, message: `Failed to add new career.\n
            Error: ${err}`
            })
        } else {
            res.json({success: true, message: "Successfully added career."})
        }
    })

});

// Update
CareersRouter.put('/', Auth.Verify, (req, res, next) => {
    Careers.getCareer(req.body._id, (err, careers) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to get career failed. Error: ${err}`
            })
        } else if (careers) {
            if (req.body.title) careers.title = req.body.title;
            if (req.body.ownerID) careers.ownerID = req.body.ownerID;
            if (req.body.hours) careers.hours = req.body.hours;
            if (req.body.link) careers.link = req.body.link;
            if (req.body.location) careers.location = req.body.location;
            if (req.body.deadlineDate) careers.deadlineDate = req.body.deadlineDate;
            if (req.body.description) careers.description = req.body.description;

            Careers.updateCareer(req.body._id, careers, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: `Attempt to update career failed. Error: ${err}`
                    })
                } else {
                    res.json({
                        success: true,
                        message: `Update Successful.`,
                        careers: careers
                    })
                }
            });
        } else {
            res.status(404).send({
                success: false,
                message: `404: Career does not exist.`
            })
        }
    });
});

// Delete
CareersRouter.delete('/:id', Auth.Verify, (req, res, next) => {
    Careers.getCareer(req.params.id, (err, careers) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to find career failed. Error: ${err}`
            })
        } else if (careers) {
            Careers.deleteCareer(careers, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: `Attempt to delete career failed. Error: ${err}`
                    })
                } else {
                    res.json({
                        success: true,
                        message: `Career deleted successfully.`
                    })
                }
            });
        } else {
            res.status(404).send({
                success: false,
                message: `404: Career does not exist.`
            })
        }
    })
});

module.exports = CareersRouter;