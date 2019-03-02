const { AssertionError } = require('assert');
const { MongoError } = require('mongodb');
const app = require('express')();
const pluralize = require('pluralize');

handleValidationError = (error, req, res, next) => {
    if (error.name === 'ValidationError') {
        // If error is {Path `property` is requried} remove the 'Path ' bit.
        if (error.errors.title.kind === 'required')
            {return res.status(400).json({
            success: false,
            message: error.errors.title.message.split('Path ')[1]
        });}
    }
    next(error);
};

handleAssertionError = (error, req, res, next) => {
    if (error instanceof AssertionError) {
        return res.status(400).json({
            type: 'AssertionError',
            message: error.message
        });
    }
    next(error);
};

// If the URL gets messed with simply redirect to homepage.
handleURIError = (error, req, res, next) => {
    if (error instanceof URIError) {
        return res.redirect('/')
    }

    next(error)
};

handleDatabaseError = (error, req, res, next) => {
    if (error instanceof MongoError) {
        console.log(error);
        // if 11000 error there is a duplicate key. This parses the error message to make it user friendly.
        if (error.code === 11000) {
            let object = pluralize.singular(error.message.split('index: cyberinthecity.')[1].split('.')[0]);
            let dupKey = error.message.split('dup key: { : "')[1].split('" }')[0];
            let key = error.message.split('.$')[1].split('_1 dup')[0];
            let errMessage = `There is already a ${object} with the ${key} '${dupKey}'`;

            // 409 = dupe error code
            return res.status(409).json({
                success: false,
                message: errMessage
            })
        }
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
    next(error);
};

handleOtherError = (error, req, res, next) => {
    console.log(`[${new Date()}] : ${error}`);

    return res.status(500).json({
        success: false,
        message: `Something broke. Please try again.`
    });
};

module.exports =
    [
        handleValidationError,
        handleAssertionError,
        handleDatabaseError,
        handleURIError,
        handleOtherError
    ];
