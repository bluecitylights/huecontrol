const hueControl = require('../../hue');
console.log('routes/users/index');
const routes = require('express').Router();
const auth = require('../authenticate');

routes.post('/authenticate', (req, res) => {
  //console.log('authenticating %s', req.body.username);
  const authResult = hueControl.authenticate(req.body);
  res.send(authResult);
});
  

routes.route('/')
    .all(auth.validate)
    .get((req, res) => {
        res.send({users: hueControl.getUsers()});
    })
    .post((req, res) => {
        console.log('we are adding the user');
        console.log(req.body);
        const user = hueControl.addUser(req.body);
        res.send(user);
      });

routes.route('/:id')
      .all((req, res, next) => {
        console.log('looking up');
        console.log(req.params);
        req.user = hueControl.getUser(req.params.id);
        next();
      })
      .get((req, res) => {
        console.log('getting %s', req.user);
        res.send(req.user);
      });

module.exports = routes;