const hueControl = require('../../hue');
const routes = require('express').Router();
const auth = require('../authenticate');

routes.route('/')
    .all((req, res, next) => {
        auth.validate(req, res, next).catch(next)
    })
    .get((req, res, next) => {
         hueControl.getBridge()
            .then(bridge => res.send(bridge))
            .catch(next);
        })
    .post((req, res, next) => {
        console.log('posting bridge');
        const ip = req.body.ipAddress;
        hueControl.setBridge(ip)
            .then(res.end())
            .catch(next);
        });

module.exports = routes;