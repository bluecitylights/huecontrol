const hueControl = require('../../hue');
console.log('routes/briddge/index');
const routes = require('express').Router();

routes.route('/')
  .get((req, res) => {
      const bridge = hueControl.getBridge();
      console.log('route bridge %s', bridge);
      res.send(bridge);
    })
    .post((req, res) => {
        const ip = req.body.ipAddress;
        hueControl.setBridge(ip);
        res.end();
    });

module.exports = routes;