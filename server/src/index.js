const express = require('express');
const routes = require('./routes');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use('/static', express.static('public/static'));
app.use(morgan('dev'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/', routes);

const HTTP_SERVER_ERROR = 500;
app.use(function(err, req, res, next) {
  console.log(`error: ${err}`);
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || HTTP_SERVER_ERROR).json('500');
});

// app.use('*', (req, res) => {
//     res.send();
// });

app.listen(port, () => console.log(`Listening on port ${port}`));