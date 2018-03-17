const hueControl = require('../../hue');
const routes = require('express').Router();
const auth = require('../authenticate');

routes.route('/')
    .all((req, res, next) => {
        auth.validate(req, res, next).catch(next)
    })
    .get((req, res, next) => {
         hueControl.getLights()
            .then(lights => res.send(lights))
            .catch(next);
    })
    .post((req, res, next) => {
        hueControl.setLight(req.body).then(light => res.send(light)).catch(next);
    });

module.exports = routes;