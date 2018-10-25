const express = require('express');
const PeopleRouter = express.Router();
const Person = require('../models/Person');

PeopleRouter.get('/', (req, res) => {
    Person.getAllPeople((err, people) => {
        if (err) {
            res.json({
                success: false, message: `Failed to get all people.\n
            Error: ${err}`
            })
        }
        else {
            res.json({success: true, people: people})
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
            res.json({success: false, message: `Failed to add new person.\n
            Error: ${err}`})
        }
        else {
            res.json({success: true, message: "Successfully added person."})
        }
    })

});


PeopleRouter.delete('/:id', (req, res, next) => {
    res.send("DELETE");

});

module.exports = PeopleRouter;