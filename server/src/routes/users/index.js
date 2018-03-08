const hueControl = require('../../hue');
console.log('routes/users/index');
const routes = require('express').Router();
const auth = require('../authenticate');

routes.post('/authenticate', (req, res, next) => {
  hueControl.authenticate(req.body)
    .then(x => {
      console.log('in post');
      res.send(JSON.stringify(x));
    })
    .catch(next);
});
  

routes.route('/')
    .all((req, res, next) => {
      auth.validate(req, res, next).catch(next)
    })
    .get((req, res, next) => {
      hueControl.getUsers().then(users => res.send(users)).catch(next);
    })
    .post((req, res, next) => {
        hueControl.addUser(req.body).then(user => res.send(user)).catch(next);
    });

routes.route('/:id')
  .all((req, res, next) => {
    auth.validate(req, res, next).catch(next)
  })
  .get((req, res, next) => {
    hueControl.getUser(req.params.id).then(user => res.send(user)).catch(next);
  });

module.exports = routes;