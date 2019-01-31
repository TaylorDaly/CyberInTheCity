const {AssertionError} = require('assert');
const {MongoError} = require('mongodb');
const app = require('express')();

handleAssertionError = (error, req, res, next) => {
    if (error instanceof AssertionError) {
        return res.status(400).json({
            type: 'AssertionError',
            message: error.message
        });
    }
    next(error);
};

handleURIError = (error, req, res, next) => {
    if (error instanceof URIError){
        return res.redirect('/')
    }

    next(error)
};

handleDatabaseError = (error, req, res, next) => {
    if (error instanceof MongoError) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: `Error: ${error.message}`
            })
        }
        return res.status(500).json({
            type: 'MongoError',
            message: error.message
        });
    }
    next(error);
};

handleOtherError = (error, req, res, next) => {
    return res.status(500).json({
        message: `Error: ${error.message}. Please try again.`
    });
};

module.exports =
[
    handleAssertionError,
    handleDatabaseError,
    handleURIError,
    handleOtherError,
];
