// Dependencies
const express = require('express');
const UserRouter = express.Router();
const Person = require('../models/Person');
const bcrypt = require('bcryptjs');
const regex = require('../Config/Regex.js');
const jwt = require('jsonwebtoken');
const dbConfig = require('../config/database');
const Image = require('../models/Image');

UserRouter.post('/verify', (req, res) => {
    let token = req.body.token;
    if (!token) return res.status(403).json({auth: false, message: 'No token provided.'});

    jwt.verify(token, dbConfig.registerSecret, function (err, decoded) {
        if (err) {
            return res.status(403).json({auth: false, message: 'Failed to authenticate token.'})
        } else {
            Person.findOne({email: decoded.email}, 'email', (err, person) => {
                if (err) {
                    return res.status(500).json({
                        auth: false, message: `Something broke when attempting to find user. Error: ${err}`
                    })
                } else if (person) {
                    return res.status(409).json({auth: false, message: `Email already exists.`})
                } else {
                    return res.json({
                        email: decoded.email,
                        auth: true,
                        message: `Token authenticated.`
                    });
                }
            })
        }
    });
});

UserRouter.post('/signup/:token', (req, res) => {
    let token = req.params.token;
    if (!token) return res.status(400).json({auth: false, message: 'No token provided.'});

    jwt.verify(token, dbConfig.registerSecret, function (err, decoded) {
        if (err) {
            return res.status(401).json({auth: false, message: 'Failed to authenticate token.'})
        } else {
            let newPerson = new Person({
                name: req.body.name,
                role: req.body.role,
                email: decoded.email,
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
                            success: false,
                            message: err.message
                        });
                    } else {
                        newPerson.password = hash;

                        let newPic = new Image({
                            buffer: req.body.photo.buffer,
                            content_type: req.body.photo.content_type
                        });

                        Image.saveImage(newPic, (err, img) => {
                            if (err) {
                                res.json({
                                    success: false,
                                    message: `Failed to save image. Error: ${err}`
                                })
                            } else {
                                newPerson.photo = img._id;
                                Person.addPerson(newPerson, (err) => {
                                    if (err) {
                                        res.status(500).json({
                                            success: false, message: `Failed to add new user. Error: ${err}`
                                        })
                                    } else {
                                        res.json({success: true, message: "Successfully added person."});
                                    }
                                })
                            }
                        });
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
        }
    });
});

UserRouter.post('/login', (req, res) => {
    let password = req.body.password;
    let email = req.body.email;
    Person.findOne({email: email}, 'email password _id', (err, person) => {
        if (err) {
            return res.status(500).json({
                success: false, message: `Something broke when attempting to find user. Error: ${err}`
            })
        } else if (person) {
            bcrypt.compare(password, person.password, (err, result) => {
                if (err)
                    return res.status(500).json({
                        success: false,
                        message: `Something broke when attempting to login. Error: ${err}`
                    });
                else if (result) {
                    const jwtToken = jwt.sign({
                            email: person.email,
                            _id: person._id,
                        },
                        dbConfig.secret,
                        {
                            expiresIn: '24h'
                        });
                    return res.status(200).json({
                        success: true,
                        message: "Login successful.",
                        token: jwtToken
                    });
                } else
                    return res.status(401).json({success: false, message: "Password incorrect."})
            });
        } else {
            return res.status(400).json({
                success: false,
                message: `Email does not exist.`
            })
        }
    })
});

UserRouter.post('/signup', (req, res) => {
    let email = req.body.email;
    Person.findOne({email: email}, 'email', (err, person) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: `Attempt to get email failed. Error: ${err}`
            });
        } else if (person) {
            res.status(409).json({
                success: false,
                message: 'Email already registered. Please use a different email.'
            });
        } else {
            // Verify email
            if (regex.email.exec(email)) {

                let nodemailer = require('nodemailer');

                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.gmailName,
                        pass: process.env.gmailSecret
                    }
                });

                let token = jwt.sign({email: req.body.email}, dbConfig.registerSecret, {
                    expiresIn: 7200 // expires in 2 hours
                });

                let signupUrl = req.protocol + '://' + req.get('host') + '/signup/' + token.toString();
                let mailOptions = {
                    from: '"DoNotReplyCyberInTheCity" <DoNotReplyCyberInTheCity@gmail.com>', // sender address
                    to: email,
                    subject: 'Cyber In the City Sign up',
                    //text: 'That was easy!',
                    html: '<a>Thank you for signing up with Cyber In the City. Please click the button below' +
                        ' to finish signing up.<br/></a><br/><div><!--[if mso]>\n' +
                        '  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" ' +
                        `href="${signupUrl}" style="height:40px;v-text-anchor:middle;width:250px;" ` +
                        'arcsize="45%" strokecolor="#e6e6e8" fillcolor="#fafafb">\n    <w:anchorlock/>\n' +
                        '    <center style="color:#000000;font-family:sans-serif;font-size:13px;font-weight:bold;">Finish Sign Up</center>\n' +
                        `  </v:roundrect>\n<![endif]--><a href="${signupUrl}"\n` +
                        'style="background-color:#fafafb;border:1px solid #b1b1b9;border-radius:18px;color:#000000;display:' +
                        'inline-block;font-family:sans-serif;font-size:13px;font-weight:bold;line-height:40px;text-align:center;' +
                        'text-decoration:none;width:250px;-webkit-text-size-adjust:none;mso-hide:all;">Finish Sign Up</a></div>',
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                res.json({
                    success: true,
                    message: 'Email sent. Please check your email to finish signing up.'
                });
            } else {
                res.json({
                    success: false,
                    message: 'Email must be a CU Denver school email.'
                });
            }
        }
    })
});

module.exports = UserRouter;