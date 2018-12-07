// Dependencies
const express = require('express');
const PeopleRouter = express.Router();
const Person = require('../models/Person');
const regex = require('../Config/Regex.js');
const bcrypt = require('bcryptjs');

PeopleRouter.get('/', (req, res) => {
    let query = req.query;
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
    Person.getPerson({_id: req.params.id}, (err, person) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to get person failed. Error: ${err}`
            })
        } else if (person) {
            res.json(person)
        } else {
            res.status(404).send({
                success: false,
                message: `404: Person does not exist.`
            })
        }
    })
});

//TODO: move to User Controller Sign-up path
PeopleRouter.post('/', (req, res) => {

    let newPerson = new Person({
        name: req.body.name,
        role: req.body.role,
        photo: req.body.photo,
        email: req.body.email,
        //password: req.body.password,
        phone_number: req.body.phone_number,
        office_location: req.body.office_location,
        links: req.body.links,
        my_website_link: req.body.my_website_link,
        google_scholar_link: req.body.google_scholar_link
    });

    // Verify password requirements and does not contain other characters
    if (regex.password.exec(req.body.password) && !regex.disallowedCharacters.exec(req.body.password)) {

        bcrypt.hash(req.body.password, 12, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            } else {
                newPerson.password = hash;
                Person.addPerson(newPerson, (err, callback) => {
                    if (err) {
                        res.json({
                            success: false, message: `Failed to add new person. Error: ${err}`
                        })
                    } else {
                        res.json({success: true, message: "Successfully added person."})
                    }
                })
            }
        });
    } else {
        res.json({
            success: false,
            message: 'Password must contain at least one upper case letter, ' +
                'one lower case letter, ' +
                'one number, ' +
                'one special character (#?!@$%^&*-), ' +
                'and be eight characters in length. ' +
                'Other characters are not allowed.'
        });
    }
});

PeopleRouter.delete('/:id', (req, res) => {
    Person.getPerson({_id: req.params.id}, (err, person) => {
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

PeopleRouter.put('/', (req, res) => {

    Person.getPerson({_id: req.body._id}, (err, person) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to get person failed. Error: ${err}`
            })
        } else if (person) {
            if (req.body.name) person.name = req.body.name;
            if (req.body.role) person.role = req.body.role;
            // TODO: consider sys_role security
            // if (req.body.sys_role) person.sys_role = req.body.sys_role;
            if (req.body.password) person.password = req.body.password;
            if (req.body.photo) person.photo = req.body.photo;
            if (req.body.email) person.email = req.body.email;
            if (req.body.phone_number) person.phone_number = req.body.phone_number;
            if (req.body.office_location) person.office_location = req.body.office_location;
            if (req.body.links) person.links = req.body.links;
            if (req.body.google_scholar_link) person.google_scholar_link = req.body.google_scholar_link;
            if (req.body.my_website_link) person.my_website_link = req.body.my_website_link;

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