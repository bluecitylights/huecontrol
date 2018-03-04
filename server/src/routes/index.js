console.log('routes/index');

const routes = require('express').Router();
const users = require('./users');
const bridge = require('./bridge');

routes.use('/api/users', users);
routes.use('/api/bridge', bridge);

routes.get('/', (req, res) => {
    res.status(200).json({message: 'connected'});
});

routes.get('/api/hello', (req, res) => {
    res.send({ express: 'Welcome to HUE Control' });
    });
  

module.exports = routes;