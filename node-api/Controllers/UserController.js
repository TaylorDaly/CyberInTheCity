// Dependencies
const express = require('express');
const UserRouter = express.Router();
const Person = require('../models/Person');
const bcrypt = require('bcryptjs');
const regex = require('../Config/Regex.js');

UserRouter.post('/signup/:token', (req, res) => {

    let newPerson = new Person({
        name: req.body.name,
        role: req.body.role,
        photo: req.body.photo,
        email: req.body.email,
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
                    return res.status(500).json({success: false, message: `Something broke when attempting to login. Error: ${err}`});
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

UserRouter.post('/signup', (req, res) => {
    let email = req.body.email;
    // Verify email
    if (regex.email.exec(email)) {

        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.gmailName,
                pass: process.env.gmailSecret
            }
        });

        var mailOptions = {
            from: '"DoNotReplyCyberInTheCity" <DoNotReplyCyberInTheCity@gmail.com>', // sender address
            to: email,
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.json({
            success: true,
            message: 'Email is good'
        });
    } else {
        res.json({
            success: false,
            message: 'Email is not a school one'
        });
    }
});

module.exports = UserRouter;