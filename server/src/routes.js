const express = require('express');
const router = express.Router();
const hueControl = require('./hue.js');

router.get('/hello', (req, res) => {
  res.send({ express: 'Welcome to HUE Control' });
  });
  
router.route('/bridge')
    .get((req, res) => {
        res.send(hueControl.getBridge());
    })
    .post((req, res) => {
        const ip = req.body.ipAddress;
        hueControl.setBridge(ip);
        res.end();
    });
  
router.route('/users')
    .get((req, res) => {
        res.send({users: hueControl.getUsers()});
    })
    .post((req, res) => {
        console.log('we are adding the user');
        console.log(req.body);
        const user = hueControl.addUser(req.body);
        res.send(user);
      });

router.route('/users/:id')
      .all((req, res, next) => {
        console.log('looking up');
        console.log(req.params);
        req.user = hueControl.getUser(req.params.id);
        next();
      })
      .get((req, res) => {
        console.log('getting');
        res.send(req.user);
      });

  

module.exports.router = router;