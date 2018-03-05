const hueControl = require('../../hue');
console.log('routes/admin/index');
const routes = require('express').Router();

routes.route('/')
  .get((req, res) => {
      console.log('admin called');
      res.send('admin called');
    });

routes.route('/init')
    .get((req, res) => {
        const initResult = hueControl.init();
        res.send(initResult);
    });

    routes.route('/clean')
    .get((req, res) => {
        console.log('cleaning route');
        hueControl.clean()
            .then(cleanResult => {
            
                console.log('cleanresult %s', cleanResult);
                res.send(cleanResult);
            })
            .catch(err => {
                console.log('cleaning failed :(');
            })
    });

module.exports = routes;