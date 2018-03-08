const hueControl = require('../../hue');
const routes = require('express').Router();
const auth = require('../authenticate');

routes.route('/')
    .all((req, res, next) => {
        auth.validate(req, res, next).catch(next)
    })
    .get((req, res, next) => {
        res.send('admin called');
    });

routes.route('/clean')
    .all((req, res, next) => {
        auth.validate(req, res, next).catch(next)
    })
    .get((req, res, next) => {
        return hueControl.clean().then(cleanResult => res.send(cleanResult)).catch(next);
    });

module.exports = routes;