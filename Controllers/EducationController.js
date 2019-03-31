const express = require('express');
const EducationRouter = express.Router();
const Education = require('../Models/Education');
const Auth = require('../Config/AuthController');
const request = require('request');

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
            //res.json({success: true, education: education})
            res.json(education)
        }
    })
});

// Get one education object
EducationRouter.get('/:course', (req, res) => {
    let courseInfo = req.params.course.split('-');
    let department = courseInfo[0];
    let courseNumber = courseInfo[1];
    let courseSection = courseInfo[2];
    let query = {department: department, courseNumber: courseNumber, courseSection: courseSection};
    Education.getEducation(query, (err, education) => {
        if (err) {
            res.status(404).json({
                success: false, message: `Failed to get find course with given parameters.`
            })
        }
        else {
            //res.json({success: true, education: education})
            res.json(education)
        }
    })
});

// Add
EducationRouter.post('/', async (req, res, next) => {
    let newEducation = new Education({
        courseNumber: req.body.courseNumber,
        courseSection: req.body.courseSection,
        courseName: req.body.courseName,
        description: req.body.description,
        department: req.body.department,
        termSemester: req.body.termSemester,
        termYear: req.body.termYear,
        syllabus: req.body.syllabus,
        teacherID: req.body.teacherID
    });

    await checkDriveLink(req.body.googleDriveLink).then(link => {
        Education.googleDriveLink = link;
        Education.addEducation(newEducation, (err, callback) => {
            if (err) {
                res.json({
                    success: false, message: `Failed to add new education. Error: ${err}`
                })
            } else {
                res.json({success: true, message: "Successfully added education."})
            }
        })
    }).catch(err => res.status(401).json({
        success: false,
        message: `${err}`
    }))
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
            if (req.body.courseSection) education.courseSection = req.body.courseSection;
            if (req.body.description) education.description = req.body.description;
            if (req.body.department) education.department = req.body.department;
            if (req.body.termSemester) education.termSemester = req.body.termSemester;
            if (req.body.termYear) education.termYear = req.body.termYear;
            if (req.body.googleDriveLink) education.googleDriveLink = req.body.googleDriveLink;
            if (req.body.syllabus) education.syllabus = req.body.syllabus;
            if (req.body.teacherID) education.teacherID = req.body.teacherID;

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


// This function parses the drive link and makes a request to it an assures the link returns 200 status and then
// reformats it for embedding and displaying.
const checkDriveLink = async (link) => {
    return new Promise(async (resolve, reject) => {
        // If link was not passed in set the google_drive_link to undefined so it is not a part of the request.
        if (!link) return resolve(undefined);
        link = link.toString().toLowerCase();
        try {
            // If this passes drive link is already in correct format.
            if (link.includes('https://drive.google.com/embeddedfolderview?id=') && link.includes('#grid')) {
                // Drive link already in correct format, try to get it and make sure it's active.
                request(link, (error, response) => {
                    if (error) {
                        return reject(error)
                    } else if (response.statusCode === 200) {
                        return resolve(link);
                    } else {
                        return reject(new Error("Request to access google drive link failed. Please double check the URL make sure it is a public folder and update the URL."));
                    }
                });
            } else if (link.includes('open?id=')) {
                try {
                    let folderId = link.split('open?id=')[1];
                    let first = "https://drive.google.com/embeddedfolderview?id=";
                    let second = "#grid";
                    request(first + folderId + second, (error, response) => {
                        if (error) {
                            return reject(error)
                        } else if (response.statusCode === 200) {
                            return resolve(first + folderId + second);
                        } else {
                            return reject(new Error("Request to get google drive link failed with status" +
                                ` ${response.statusCode}.` +
                                " Please double check the URL make sure it is a public folder."));
                        }
                    });
                } catch (err) {
                    return reject(new Error("Error parsing google drive link. Please double check the URL and make sure it is a public folder."))
                }
            } else {
                try {
                    let driveTokens = link.split("/");
                    let folderId = driveTokens[driveTokens.length].split('?')[0];
                    let first = "https://drive.google.com/embeddedfolderview?id=";
                    let second = "#grid";
                    console.log(first + folderId + second);
                    request(first + folderId + second, (error, response) => {
                        if (error) {
                            return reject(error)
                        } else if (response.statusCode === 200) {
                            return resolve(first + folderId + second);
                        } else {
                            return reject(new Error("Request to get google drive link failed. Please double check the URL make sure it is a public folder."));
                        }
                    });
                } catch (err) {
                    return reject(new Error("Error parsing google drive link. Please double check the URL and make sure it is a public folder."))
                }
            }
        } catch (err) {
            return reject(err);
        }
    })
};

module.exports = EducationRouter;