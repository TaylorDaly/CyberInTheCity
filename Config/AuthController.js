const jwt = require('jsonwebtoken');
const dbConfig = require('./Database.js');
const Person = require('../Models/Person');

// Add to paths that require a user to have a token and any permission level.
let Verify = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token) {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        // Verifies token against our secret
        jwt.verify(token, dbConfig.secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: `Unable to verify token. Error: ${err}`
                });
            } else {
                // Get Person from DB to check sys_role
                Person.findOne({ _id: decoded._id }, 'sys_role', (err, person) => {
                    if (err) {
                        res.status(500).json({
                            success: false, message: `Something broke when attempting to find user.`
                        })
                    } else if (person) {
                        decoded['sys_role'] = person.sys_role;
                        req.decoded = decoded;
                        next();
                    } else {
                        res.status(401).json({
                            success: false,
                            message: `User no longer exists or token is invalid. Please try logging in again.`
                        })
                    }
                });
            }
        });
    } else {
        return res.status(400).json({
            success: false,
            message: 'Token is required.'
        });
    }
};

// Add to paths that require Admin level access or higher
let VerifyAdmin = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token) {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        // Verifies token against our secret
        jwt.verify(token, dbConfig.secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: `Unable to verify token. Error: ${err}`
                });
            } else {
                // Get Person from DB to check sys_role
                Person.findOne({ _id: decoded._id }, 'sys_role', (err, person) => {
                    if (err) {
                        res.status(500).json({
                            success: false, message: `Something broke when attempting to find user.`
                        })
                    } else if (person) {
                        if (person.sys_role !== 'Admin' && person.sys_role !== 'Sys_Admin') {
                            res.status(401).json({
                                success: false,
                                message: 'You do not have permission to access this resource.'
                            })
                        } else {
                            decoded['sys_role'] = person.sys_role;
                            req.decoded = decoded;
                            next();
                        }
                    } else {
                        res.status(401).json({
                            success: false,
                            message: `User no longer exists or token is invalid. Please try logging in again.`
                        })
                    }
                });
            }
        });
    } else {
        return res.status(400).json({
            success: false,
            message: 'Token is required.'
        });
    }
};

// Add to paths that require Sys_Admin level access.
let VerifySysAdmin = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token) {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        // Verifies token against our secret
        jwt.verify(token, dbConfig.secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: `Unable to verify token. Error: ${err}`
                });
            } else {
                // Get Person from DB to check sys_role
                Person.findOne({ _id: decoded._id }, 'sys_role', (err, person) => {
                    if (err) {
                        res.status(500).json({
                            success: false, message: `Something broke when attempting to find user.`
                        })
                    } else if (person) {
                        if (person.sys_role !== 'Sys_Admin') {
                            res.status(401).json({
                                success: false,
                                message: 'You do not have permission to access this resource.'
                            })
                        } else {
                            decoded['sys_role'] = person.sys_role;
                            req.decoded = decoded;
                            next();
                        }
                    } else {
                        res.status(401).json({
                            success: false,
                            message: `User no longer exists or token is invalid. Please try logging in again.`
                        })
                    }
                });
            }
        });
    } else {
        return res.status(400).json({
            success: false,
            message: 'Token is required.'
        });
    }
};


module.exports = {
    Verify: Verify,
    VerifyAdmin: VerifyAdmin,
    VerifySysAdmin: VerifySysAdmin
};
