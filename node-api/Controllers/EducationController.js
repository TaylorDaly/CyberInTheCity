const express = require('express');
const EducationRouter = express.Router();
const Education = require('../models/Education');

// Get all education
EducationRouter.get('/', (req, res) => {
    Education.getAllEducations((err, education) => {
        if (err) {
            res.json({
                success: false, message: `Failed to get all education.\n
            Error: ${err}`
            })
        }
        else {
            res.json({success: true, education: education})
        }
    })
});


// Add
EducationRouter.post('/', (req, res, next) => {
    let newEducation = new Education({
        courseNumber: req.body.courseNumber,
        courseName: req.body.courseName,
        description: req.body.description,
        category: req.body.category,
        department: req.body.department,
        termYear: req.body.termYear,
        content: req.body.content,
        syllabus: req.body.syllabus
    });

    Education.addEducation(newEducation, (err, callback) => {
        if (err) {
            res.json({
                success: false, message: `Failed to add new education.\n
            Error: ${err}`
            })
        }
        else {
            res.json({success: true, message: "Successfully added education."})
        }
    })

});

// Update
EducationRouter.put('/', (req, res, next) => {
    Education.getEducation(req.body._id, (err, education) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to get education failed. Error: ${err}`
            })
        }
        else if (education) {
            if (req.body.courseNumber) education.courseNumber = req.body.courseNumber;
            if (req.body.courseName) education.courseName = req.body.courseName;
            if (req.body.description) education.description = req.body.description;
            if (req.body.category) education.category = req.body.category;
            if (req.body.department) education.department = req.body.department;
            if (req.body.termYear) education.termYear = req.body.termYear;
            if (req.body.content) education.content = req.body.content;
            if (req.body.syllabus) education.syllabus = req.body.syllabus;

            Education.updateEducation(req.body._id, education, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: `Attempt to update education failed. Error: ${err}`
                    })
                }
                else {
                    res.json({
                        success: true,
                        message: `Update Successful.`,
                        education: education
                    })
                }
            });
        }
        else {
            res.status(404).send({
                success: false,
                message: `404: Education does not exist.`
            })
        }
    });
});
EducationRouter.delete('/:id', (req, res, next) => {
    Education.getEducation(req.params.id, (err, education) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to find education failed. Error: ${err}`
            })
        }
        else if (education) {
            Education.deleteEducation(education, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: `Attempt to delete education failed. Error: ${err}`
                    })
                }
                else {
                    res.json({
                        success: true,
                        message: `Education deleted successfully.`
                    })
                }
            });
        }
        else {
            res.status(404).send({
                success: false,
                message: `404: Education does not exist.`
            })
        }
    })
});

module.exports = EducationRouter;