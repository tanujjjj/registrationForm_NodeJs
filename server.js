
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const app = express();
dotenv.config();

const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./routes/routes.js')(app, fs);
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log('listening on port %s...', server.address().port);
});