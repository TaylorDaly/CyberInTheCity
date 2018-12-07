// Dependencies
const express = require('express');
const UserRouter = express.Router();
const Person = require('../models/Person');
const bcrypt = require('bcryptjs');

UserRouter.post('/login', (req, res) => {
    let password = req.body.password;
    let email = req.body.email;
    Person.findOne({email: email}, 'email password', (err, person) => {
        if (err) {
            return res.status(500).json({
                success: false, message: `Something broke when attempting to find user. Error: ${err}`
            })
        } else if (person) {
            // TODO: Return JWT on success
            bcrypt.compare(password, person.password, (err, result) => {
                if (err)
                    return res.status(500).json({message: `Something broke when attempting to login. Error: ${err}`});
                else if (result)
                    return res.status(200).json({success: true, message: "Login successful."});
                else
                    return res.status(401).json({success: false, message: "Password incorrect."})
            });
        } else {
            return res.status(404).json({
                success: false,
                message: `Email does not exist.`
            })
        }
    })
});

module.exports = UserRouter;