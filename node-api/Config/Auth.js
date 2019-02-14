let jwt = require('jsonwebtoken');
const dbConfig = require('./Database.js');

let Verify = (req, res, next) => {
    // TODO: delete dev token later.
    let token = req.headers['x-access-token'] || req.headers['authorization'] || process.env.DEV_TOKEN;

    if (token) {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        jwt.verify(token, dbConfig.secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: `Unable to verify token. Error: ${err}`
                });
            } else {
                //TODO: get user role to block certain paths.
                req.decoded = decoded;
                next();
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
    Verify: Verify
};