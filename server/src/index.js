const express = require('express');
const hueControl = require('./hue.js');

const app = express();
const port = process.env.PORT || 3001;

app.get('/api/hello', (req, res) => {
  console.log('hello called')
  res.send({ express: 'Welcome to HUE Control' });
});

app.get('/api/users', (req, res) => {
  console.log('users called')
  res.send({users: hueControl.users()});
})

app.listen(port, () => console.log(`Listening on port ${port}`));