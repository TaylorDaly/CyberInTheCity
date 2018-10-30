const express = require('express');
const PeopleRouter = express.Router();
const Person = require('../models/Person');
const Link = require('../models/Link');

PeopleRouter.get('/', (req, res) => {
    Person.getAllPeople((err, people) => {
        if (err) {
            res.json({
                success: false, message: `Failed to get all people. Error: ${err}`
            })
        }
        else {
            res.json({success: true, people: people})
        }
    })
});

PeopleRouter.get('/:id', (req, res) => {
    Person.getPerson(req.params.id, (err, person) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to get person failed. Error: ${err}`
            })
        }
        else if (person) {
            res.json(person)
        }
        else {
            res.status(404).send({
                success: false,
                message: `404: Person does not exist.`
            })
        }
    })
});

PeopleRouter.post('/', (req, res, next) => {
    let newPerson = new Person({
        name: req.body.name,
        role: req.body.role,
        photo: req.body.photo,
        email: req.body.email,
        phone_number: req.body.phone_number,
        office_location: req.body.office_location,
        links: req.body.links,
        google_scholar_link: req.body.google_scholar_link
    });

    Person.addPerson(newPerson, (err, callback) => {
        if (err) {
            res.json({
                success: false, message: `Failed to add new person. Error: ${err}`
            })
        }
        else {
            res.json({success: true, message: "Successfully added person."})
        }
    })
});

PeopleRouter.delete('/:id', (req, res, next) => {
    Person.deletePerson(req.params.id, (err) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to delete person failed. Error: ${err}`
            })
        }
        else {
            res.json({
                success: true,
                message: `Delete Successful.`
            })
        }
    })
});

PeopleRouter.put('/', (req, res, next) => {
    Person.getPerson(req.body._id, (err, person) => {
        if (err) {
            res.json({
                success: false,
                message: `Attempt to get person failed. Error: ${err}`
            })
        }
        else if (person) {
            if (req.body.name) person.name = req.body.name;
            if (req.body.role) person.role = req.body.role;
            // TODO: consider sys_role security
            if (req.body.sys_role) person.sys_role = req.body.sys_role;
            if (req.body.photo) person.photo = req.body.photo;
            if (req.body.email) person.email = req.body.email;
            if (req.body.phone_number) person.phone_number = req.body.phone_number;
            if (req.body.office_location) person.office_location = req.body.office_location;
            if (req.body.links) person.line = req.body.links;
            if (req.body.google_scholar_link) person.google_scholar_link = req.body.google_scholar_link;

            Person.updatePerson(req.body._id, person, (err) => {
                if (err) {
                    res.json({
                        success: false,
                        message: `Attempt to update person failed. Error: ${err}`
                    })
                }
                else {
                    res.json({
                        success: true,
                        message: `Update Successful.`,
                        person: person
                    })
                }
            });
        }
        else {
            res.status(404).send({
                success: false,
                message: `404: Person does not exist.`
            })
        }
    });
});

module.exports = PeopleRouter;