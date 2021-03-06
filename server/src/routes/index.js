const routes = require('express').Router();
const users = require('./users');
const bridge = require('./bridge');
const admin = require('./admin');

routes.use('/api/users', users);
routes.use('/api/bridge', bridge);
routes.use('/api/admin', admin);

routes.get('/', (req, res, next) => {
    res.status(200).json({message: 'connected'});
});

routes.get('/api/hello', (req, res, next) => {
    res.send({ express: 'Welcome to HUE Control' });
    });
  

module.exports = routes;