const hueControl = require('../hue');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret = '12345';

exports.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

exports.validatePassword = (plainText, hash) => {
    console.log('plain %s', plainText);
    console.log('hash %s', hash);
    return bcrypt.compareSync(plainText, hash);
}

exports.generateToken = () => {
    return jwt.sign(payload, secret, {
        expiresIn: 60*60*24
    });
}

exports.validate = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, secret, function(err, decoded) {      
        if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
        } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;    
            next();
        }
    });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });

    }
    next();
}