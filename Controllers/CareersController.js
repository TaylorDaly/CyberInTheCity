const express = require('express');
const CareersRouter = express.Router();
const Careers = require('../Models/Careers');
const Auth = require('../Config/AuthController');
const request = require('request');
var schedule = require('node-schedule');

//a scheduler for removing the on campus posting
//only allowing for the posting to be active for 30 days
schedule.scheduleJob('0 0 * * *', function () {
    let eraseMonth = new Date(new Date().setDate(new Date().getDate() - 30));//.getMonth() + 1;
    Careers.getAllCareers((err, careers) => {
        let careerID;
        let careerDate;
        if (err) {
            next(err)
        } else {
            for (let i = 0; i < careers.length; i++) {
                careerID = careers[i]._id;
                careerDate = careers[i].postedDate;
                if (careerDate <= eraseMonth) {
                    jobtitle = careers[i].jobtitle;
                    Careers.deleteCareer(careers[i], (err) => {
                        if (err) {
                            console.log(`[${new Date()}] : ${err}`)
                        } else {
                            console.log(`[${new Date()}] : Successfully removed expired Career.` + jobtitle);
                        }
                    });
                }
            }
        }
    })

});

// Get all careers
CareersRouter.get('/', (req, res, next) => {
    Careers.find({}).sort({postedDate: 'asc'}).exec((err, careers) => {
        if (err) {
            next(err)
        } else {
            let final = {};
            final['ourCareers'] = careers;
            // If query specifies only our careers, skip the indeed call.
            if (req.query.ourCareers && req.query.ourCareers === 'true') {
                res.json(final);
            } else {
                let temp = {};
                //let total = [];
                let fullTime = [];
                let internship = [];
                request(process.env.IndeedFullTimeCall, function (error, response, body) {
                    let data = JSON.parse(body);
                    if (response.statusCode === 200 && !(data.hasOwnProperty('error'))) {
                        temp['indeed'] = data.results;
                        for (const posting of temp.indeed) {
                            let newCareers = new Careers({
                                jobtitle: posting.jobtitle,
                                company: posting.company,
                                jobType: 'FullTime',
                                url: posting.url,
                                location: posting.formattedLocation,
                                postedDate: posting.date,
                                description: posting.snippet
                            });
                            fullTime.push(newCareers);
                            //total.push(newCareers);
                        }

                        request(process.env.IndeedInternshipCall, function (error, response, body) {
                            var data = JSON.parse(body);
                            if (response.statusCode === 200 && !(data.hasOwnProperty('error'))) {
                                temp['indeed'] = data.results;
                                for (const posting of temp.indeed) {
                                    //async function or use a callback
                                    let newCareers = new Careers({
                                        jobtitle: posting.jobtitle,
                                        company: posting.company,
                                        jobType: 'Internship',
                                        url: posting.url,
                                        location: posting.formattedLocation,
                                        postedDate: posting.date,
                                        description: posting.snippet
                                    });
                                    internship.push(newCareers);
                                    //total.push(newCareers);
                                }
                                final['internship'] = internship;
                                //final['total'] = total;
                                res.json(final);
                            } else {
                                res.json({
                                    success: false,
                                    message: `Attempt to get internship indeed postings. Error: ${err}`
                                })
                            }
                        });
                        final['fullTime'] = fullTime;
                    } else {
                        res.json({
                            success: false,
                            message: `Attempt to get fullTime indeed postings. Error: ${err}`
                        })
                    }
                });
            }
        }
    })
});

// Add
CareersRouter.post('/', Auth.VerifyAdmin, (req, res, next) => {
    let today = new Date();
    let newCareers = new Careers({
        jobtitle: req.body.jobtitle,
        company: req.body.company,
        jobType: req.body.jobType,
        url: req.body.url,
        location: req.body.location,
        postedDate: today,
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
CareersRouter.put('/', Auth.VerifyAdmin, (req, res, next) => {
    Careers.getCareer(req.body._id, (err, careers) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to get career failed. Error: ${err}`
            })
        } else if (careers) {
            if (req.body.jobtitle) careers.jobtitle = req.body.jobtitle;
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
CareersRouter.delete('/:id', Auth.VerifyAdmin, (req, res, next) => {
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