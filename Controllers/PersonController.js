// Dependencies
const Auth = require('../Config/AuthController');
const express = require('express');
const PeopleRouter = express.Router();
const Person = require('../Models/Person');
const Image = require('../Models/Image');
const request = require('request');

PeopleRouter.get('/Admin', Auth.VerifyAdmin, (req, res) => {
    Person.find(req.query,
        'email _id sys_role name verified role links photo phone_number office_location biography my_website_link',
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
    let query = {verified: true};
    if (req.query.email) query['email'] = req.query.email;
    Person.getPeople(query, (err, people) => {
        if (err) {
            res.status(500).json({
                success: false, message: `Failed to get people. Error: ${err}`
            })
        } else if (people.length > 0) {
            res.json(people)
        } else {
            res.status(404).send({
                success: false,
                message: `Unable to find people or no people to show.`
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
                    res.status(200).json({
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
                delete req.body.__v;
                // The ID from the token must match the person to update, unless the user is an admin.
                if (person._id.toString() !== req.decoded._id && req.decoded.sys_role !== `Sys_Admin`) {
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
                    if (req.body.name) person.name = req.body.name;
                    if (req.body.role) person.role = req.body.role;

                    // TODO: Allow update password possibly. Need to verify old password before updating, would probably
                    //  need a separate route and email verification again.
                    // if (req.body.password) person.password = req.body.password;

                    // Not allowing email updates currently.
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
                    else person.google_scholar_link = undefined;
                    if (req.body.my_website_link) person.my_website_link = req.body.my_website_link;
                    else person.my_website_link = undefined;
                    // Checks the google drive link returns status 200 (OK)

                    try {
                        // Photo is in separate database so have to delete it separately.
                        if (req.body.photo && req.body.photo.buffer) {
                            person.photo = await updateImage(req.body.photo);
                        } else if (person.photo) {
                            await deleteImage(person.photo._id);
                            person.photo = undefined;
                        }
                    } catch (err) {
                        next(err)
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
                }
            } else {
                res.status(404).send({
                    success: false,
                    message: `404: Person does not exist.`
                })
            }
        }
    );
});

// Sys Admins can add new people
PeopleRouter.post('/', Auth.VerifySysAdmin, (req, res) => {
    let newPerson = new Person({});

    if (req.body.name) newPerson.name = req.body.name;
    if (req.body.role) newPerson.role = req.body.role;
    if (req.body.email) newPerson.email = req.body.email;
    if (req.body.phone_number) newPerson.phone_number = req.body.phone_number;
    if (req.body.biography) newPerson.biography = req.body.biography;
    if (req.body.office_location) newPerson.office_location = req.body.office_location;
    if (req.body.links) newPerson.links = req.body.links;
    if (req.body.my_website_link) newPerson.my_website_link = req.body.my_website_link;
    if (req.body.google_scholar_link) newPerson.google_scholar_link = req.body.google_scholar_link;
    if (req.body.verified) newPerson.verified = req.body.verified;

    if (req.body.photo && req.body.photo.buffer) {
        let newPic = new Image({
            buffer: req.body.photo.buffer,
            content_type: req.body.photo.content_type
        });

        Image.saveImage(newPic, (err, img) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: `Failed to save image. Error: ${err}`
                })
            } else {
                newPerson.photo = img._id;
                Person.addPerson(newPerson, (err) => {
                    if (err) {
                        res.status(500).json({
                            success: false, message: `Failed to add new person. Error: ${err}`
                        })
                    } else {
                        res.json({success: true, message: 'Successfully added person.'});
                    }
                })
            }
        });
    } else {
        Person.addPerson(newPerson, (err) => {
            if (err) {
                res.status(500).json({
                    success: false, message: `Failed to add new person. Error: ${err}`
                })
            } else {
                res.json({success: true, message: 'Successfully added person.'});
            }
        });
    }
});

const updateImage = async (photo) => {
    return new Promise((resolve, reject) => {
        if (photo._id) {
            Image.findImage(photo._id, (img, err) => {
                if (err) reject(err);
                else if (img) {
                    // Either make a new image or update the old one.
                    img.buffer = photo.buffer;
                    img.content_type = photo.content_type;

                    img.save(img, async (err, img) => {
                        if (err) {
                            return reject(err)
                        } else {
                            return resolve(img._id)
                        }
                    });
                }
            })
        } else {
            let newImg = new Image();
            newImg.buffer = photo.buffer;
            newImg.content_type = photo.content_type;
            newImg.save(newImg, async (err, img) => {
                if (err) {
                    return reject(err)
                } else {
                    return resolve(img._id)
                }
            })
        }
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
        // If link was not passed in set the google_drive_link to undefined so it is not a part of the request.
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
                    let folderId = driveTokens[driveTokens.length - 1].split('?')[0];
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

module.exports = PeopleRouter;
