// Dependencies
const Auth = require('../Config/AuthController');
const express = require('express');
const PeopleRouter = express.Router();
const Person = require('../Models/Person');
const Image = require('../Models/Image');
const request = require('request');

PeopleRouter.get('/Admin', Auth.VerifyAdmin, (req, res) => {
    Person.find(req.query,
        'email _id sys_role name verified role links photo phone_number office_location',
        (err, people) => {
        if (err) {
            res.json({
                success: false, message: `Failed to get people. Error: ${err}`
            })
        } else if (people.length > 0) {
            res.json(people)
        } else {
            res.status(404).send({
                success: false,
                message: `404: Could not find people with given parameters.`
            })
        }
    })
});

PeopleRouter.get('/', (req, res) => {
    // Only return people that have been verified by an admin.
    Person.getPeople({verified: true}, (err, people) => {
        if (err) {
            res.status(500).json({
                success: false, message: `Failed to get people. Error: ${err}`
            })
        } else if (people.length > 0) {
            res.json(people)
        } else {
            res.status(404).send({
                success: false,
                message: `Unable to find people. Please try again.`
            })
        }
    })
});

// Get the current user from token
PeopleRouter.get('/self', Auth.Verify, (req, res) => {
    Person.getPerson({_id: req.decoded._id}, (err, person) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: `Attempt to get person failed. Error: ${err}`
            })
        } else if (person) {
            res.json(person)
        } else {
            res.status(404).json({
                success: false,
                message: `Person does not exist.`
            })
        }
    })
});

PeopleRouter.get('/:id', (req, res) => {
    Person.getPerson({_id: req.params.id}, (err, person) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: `Attempt to get person failed. Error: ${err}`
            })
        } else if (person) {
            res.json(person)
        } else {
            res.status(404).json({
                success: false,
                message: `Person does not exist.`
            })
        }
    })
});

// Delete Person by _id. Only Sys_Admins may delete users.
PeopleRouter.delete('/:id', Auth.VerifySysAdmin, (req, res) => {

    Person.getPerson({_id: req.params.id}, (err, person) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to find person failed. Error: ${err}`
            })
        } else if (person) {
            Person.deletePerson(person, (err) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: `Attempt to delete person failed. Error: ${err}`
                    })
                } else {
                    res.status(500).json({
                        success: true,
                        message: `Person deleted successfully.`
                    })
                }
            });
        } else {
            res.status(404).send({
                success: false,
                message: `404: Person does not exist.`
            })
        }
    })
});

// TODO: put in user controller maybe
// This is a dual purpose route for Admins to update Sys_role and verify users, and for users to update their own
// information.
PeopleRouter.put('/', Auth.Verify, (req, res, next) => {
    Person.getPerson({_id: req.body._id}, async (err, person) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to get person failed. Error: ${err}`
            })
        } else if (person) {
            // The ID from the token must match the person to update, unless the user is an admin.
            if (person._id !== req.decoded._id && req.decoded.sys_role !== `Sys_Admin`) {
                res.status(401).json({success: false, message: 'You do not have access to update this person.'})
            } else {
                // Admin may use this route to update a sys_role. Sys_Admin is the only one that can change roles
                // and they can't change the role of another Sys_Admin.
                if (req.decoded.sys_role === 'Sys_Admin') {
                    if (person.sys_role !== 'Sys_Admin') {
                        if (req.body.sys_role) person.sys_role = req.body.sys_role;
                    }
                    if (req.body.verified) person.verified = req.body.verified;
                }
                if (req.decoded._id === person._id || req.decoded.sys_role === 'Sys_Admin') {
                    if (req.body.name) person.name = req.body.name;
                    if (req.body.role) person.role = req.body.role;

                    // TODO: update password possibly. Need to verify old password before updating.
                    // if (req.body.password) person.password = req.body.password;

                    // not allowing email updates
                    // if (req.body.email) person.email = req.body.email;

                    // else undefined will remove the key, without this one cannot remove a field.
                    if (req.body.phone_number) person.phone_number = req.body.phone_number;
                    else person.phone_number = undefined;
                    if (req.body.biography) person.biography = req.body.biography;
                    else person.biography = undefined;
                    if (req.body.office_location) person.office_location = req.body.office_location;
                    else person.office_location = undefined;
                    if (req.body.links) person.links = req.body.links;
                    if (req.body.google_scholar_link) person.google_scholar_link = req.body.google_scholar_link;
                    else person.google_scholar_linkg = undefined;
                    if (req.body.my_website_link) person.my_website_link = req.body.my_website_link;
                    else person.my_website_link = undefined;
                    // Checks the google drive link returns status 200 (OK)
                    await checkDriveLink(req.body.google_drive_link)
                        .then(async link => {
                            person.google_drive_link = link;

                            // If person has a photo, need to wait for photo to delete and new photo to upload before doing
                            // save on person object, so async is required here.
                            if (req.body.photo) {
                                if (person.photo) await deleteImage(person.photo).catch(err => {
                                    next(err)
                                });
                                person.photo = await updateImage(req).catch(err => {
                                    next(err)
                                });
                            }

                            Person.updatePerson(person, (err) => {
                                if (err) {
                                    res.json({
                                        success: false,
                                        message: `Attempt to update person failed. Error: ${err}`
                                    })
                                } else {
                                    res.json({
                                        success: true,
                                        message: `Update Successful.`,
                                        person: person
                                    })
                                }
                            });
                        })
                        .catch(err => res.status(500).json({
                            success: false,
                            message: err.message
                        }));
                } else {
                    res.status(401).json({
                        success: false,
                        message: "You do not have permission to edit this person."
                    })
                }
            }
        } else {
            res.status(404).send({
                success: false,
                message: `404: Person does not exist.`
            })
        }
    });
});

const updateImage = async (req) => {
    return new Promise((resolve, reject) => {
        let newPic = new Image({
            buffer: req.body.photo.buffer,
            content_type: req.body.photo.content_type
        });
        Image.saveImage(newPic, async (err, img) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(img._id);
            }
        });
    });
};

const deleteImage = async (_idRemove) => {
    return new Promise((resolve, reject) => {
        Image.deleteImage(_idRemove, (err) => {
            if (err) {
                return reject(err)
            } else {
                // Do nothing, delete was successful.
                return resolve()
            }
        });
    });
};

const checkDriveLink = async (link) => {
    return new Promise(async (resolve, reject) => {
        if (!link) return resolve(undefined);
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
                            return reject(new Error("Request to get google drive link failed. Please double check the URL make sure it is a public folder."));
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

// https://github.com/Automattic/mongoose/issues/1596
// https://stackoverflow.com/questions/12096262/how-to-protect-the-password-field-in-mongoose-mongodb-so-it-wont-return-in-a-qu
module.exports = PeopleRouter;
