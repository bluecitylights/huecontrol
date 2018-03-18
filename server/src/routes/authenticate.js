const hueControl = require('../hue');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.generateHash = (password) => {
    return bcrypt.hash(password, bcrypt.genSaltSync(10));
}

exports.validatePassword = (plainText, hash) => {
    console.log('plain %s', plainText);
    console.log('hash %s', hash);
    return bcrypt.compare(plainText, hash).
        then(validationResult => {
            console.log('val %s' + validationResult);
            if (validationResult) {
                console.log('auth success');
                return;
            }
            else {
                console.log('auth error');
                return Promise.reject(new Error('Authntication failed. Wrong password'));
            }
    });
}

const secret = '12345';

exports.generateToken = (payload) => {
    return Promise.resolve(jwt.sign(payload, secret, {
        expiresIn: 60*60*24
    }));
}

const getToken = req => {
    console.log('req ' + JSON.stringify(req.body));
    
    if (req.body && req.body.token) {
        return Promise.resolve(req.body.token);
    }

    if(req.query && req.query.token) {
        return Promise.resolve(req.query.token);
    }

    if (req.header('x-access-token')) {
        return Promise.resolve(req.header('x-access-token'));
    }

    return Promise.reject(new Error('no token provided'));
}

exports.validate = (req, res, next) => {
    return new Promise((resolve, reject) => {
        getToken(req).then(token => {
            jwt.verify(token, secret, function(err, decoded) {      
                if (err) {
                    reject({ success: false, message: 'Failed to authenticate token.' });
                    return;    
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;    
                    next();
                }
            })
        })
        .catch(err => reject(err))
    });
}