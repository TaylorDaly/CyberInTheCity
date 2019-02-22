const express = require('express');
const CareersRouter = express.Router();
const Careers = require('../models/Careers');
const Auth = require('../Config/AuthController');
const request = require('request');

// Get all careers
CareersRouter.get('/', (req, res, next) => {
    Careers.getAllCareers((err, careers) => {
        if (err) {
            next(err)
        } else {
            var final = {};
            var temp = {};
            var fullTime = [];
            var internship = [];
            request(process.env.IndeedFullTimeCall, function (error, response, body) {
                var data = JSON.parse(body);
                if (response.statusCode === 200 && !(data.hasOwnProperty('error'))){
                    temp['indeed'] = data.results;
                    for (const posting of temp.indeed) {
                        let newCareers = new Careers({
                            jobtitle: posting.jobtitle,
                            ownerID: 'indeed',
                            company: posting.company,
                            jobType: 'FullTime',
                            url: posting.url,
                            location: posting.formattedLocation,
                            postedDate: posting.date,
                            // description: (posting.snippet).replace(/[!@#$%^&*<b><\/b>]/g, "")
                            description: posting.snippet
                        });
                        fullTime.push(newCareers);
                    }
                    request(process.env.IndeedInternshipCall, function (error, response, body) {
                        var data = JSON.parse(body);
                        if (response.statusCode === 200 && !(data.hasOwnProperty('error'))){
                            temp['indeed'] = data.results;
                            for (const posting of temp.indeed) {
                                let newCareers = new Careers({
                                    jobtitle: posting.jobtitle,
                                    ownerID: 'indeed',
                                    company: posting.company,
                                    jobType: 'Internship',
                                    url: posting.url,
                                    location: posting.formattedLocation,
                                    postedDate: posting.date,
                                    // description: (posting.snippet).replace(/[!@#$%^&*<b><\/b>]/g, "")
                                    description: posting.snippet
                                });
                                internship.push(newCareers);
                                // console.log(newCareers);
                            }
                            final['internship'] = internship;
                            final['fullTime'] = fullTime;
                            final['ourCareers'] = careers;
                            res.json(final);
                        } else{
                            res.json({
                                success: false,
                                message: `Attempt to get internship indeed postings. Error: ${err}`
                            })
                        }
                    });
                } else{
                    res.json({
                        success: false,
                        message: `Attempt to get fullTime indeed postings. Error: ${err}`
                    })
                }
            });
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
        jobtitle: req.body.jobtitle,
        ownerID: req.body.ownerID,
        company: req.body.company,
        jobType: req.body.jobType,
        url: req.body.url,
        location: req.body.location,
        postedDate: req.body.postedDate,
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
            if (req.body.jobtitle) careers.jobtitle = req.body.jobtitle;
            if (req.body.ownerID) careers.ownerID = req.body.ownerID;
            if (req.body.company) careers.company = req.body.company;
            if (req.body.jobType) careers.jobType = req.body.jobType;
            if (req.body.url) careers.url = req.body.url;
            if (req.body.location) careers.location = req.body.location;
            if (req.body.postedDate) careers.postedDate = req.body.postedDate;
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