const express = require('express');
const bodyParser = require('body-parser');
const hueControl = require('./hue.js');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use('/static', express.static('public/static'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Welcome to HUE Control' });
});

app.get('/api/bridge', (req, res) => {
  res.send(hueControl.bridge());
})
app.post('/api/bridge', (req, res) => {
  const ip = req.body.ipAddress;
  res.end();
});

app.get('/api/users', (req, res) => {
  res.send({users: hueControl.users()});
})

app.listen(port, () => console.log(`Listening on port ${port}`));