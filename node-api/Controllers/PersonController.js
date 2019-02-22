// Dependencies
const Auth = require('../Config/AuthController');
const express = require('express');
const PeopleRouter = express.Router();
const Person = require('../models/Person');

PeopleRouter.get('/', (req, res) => {
    let query = req.query;
    // Only return people that have been verified by an admin.
    if (!query['verified']) query['verified'] = true;
    Person.getPeople(query, (err, people) => {
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

PeopleRouter.get('/:id', (req, res) => {
    Person.getPerson({ _id: req.params.id }, (err, person) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to get person failed. Error: ${err}`
            })
        } else if (person) {
            res.json(person)
        } else {
            res.status(404).json({
                success: false,
                message: `404: Person does not exist.`
            })
        }
    })
});

// Delete User by _id. Only Admins may delete users.
PeopleRouter.delete('/:id', Auth.VerifyAdmin, (req, res) => {
    Person.getPerson({ _id: req.params.id }, (err, person) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to find person failed. Error: ${err}`
            })
        } else if (person) {
            Person.deletePerson(person, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: `Attempt to delete person failed. Error: ${err}`
                    })
                } else {
                    res.json({
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
    Person.getPerson({ _id: req.body._id }, (err, person) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to get person failed. Error: ${err}`
            })
        } else if (person) {
            // The ID from the token must match the person to update, unless the user is an admin.
            if (person._id !== req.decoded._id && req.decoded.sys_role !== `Admin`) {
                res.status(401).json({ success: false, message: 'You do not have access to update this person.' })
            } else {
                // Admin may use this route to update a sys_role, but that is all they are allowed to update on
                // other people since _id's must match.
                if (req.decoded.sys_role === 'Admin') {
                    if (req.body.sys_role) person.sys_role = req.body.sys_role;
                    if (req.body.verified) person.verified = req.body.verified;
                }
                if (req.decoded._id === person._id) {
                    if (req.body.name) person.name = req.body.name;
                    if (req.body.role) person.role = req.body.role;
                    if (req.body.password) person.password = req.body.password;
                    if (req.body.photo) person.photo = req.body.photo;
                    if (req.body.email) person.email = req.body.email;
                    if (req.body.phone_number) person.phone_number = req.body.phone_number;
                    if (req.body.office_location) person.office_location = req.body.office_location;
                    if (req.body.links) person.links = req.body.links;
                    if (req.body.google_scholar_link) person.google_scholar_link = req.body.google_scholar_link;
                    if (req.body.my_website_link) person.my_website_link = req.body.my_website_link;
                }
                Person.updatePerson(req.body._id, person, (err) => {
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
    });
});

// TODO: Add in secure paths that include sys_role and passwords
// https://github.com/Automattic/mongoose/issues/1596
// https://stackoverflow.com/questions/12096262/how-to-protect-the-password-field-in-mongoose-mongodb-so-it-wont-return-in-a-qu
module.exports = PeopleRouter;
