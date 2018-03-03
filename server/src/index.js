const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use('/static', express.static('public/static'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api', require('./routes').router);

app.listen(port, () => console.log(`Listening on port ${port}`));