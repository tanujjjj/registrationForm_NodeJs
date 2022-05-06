const schema = require("./validation");

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

let data = require("../data/user");
const {
  body
} = require("express-validator");



const userRoutes = (app, fs) => {

  const dataPath = './data/user.json';

  app.post('/signup', async (req, res) => {
    try {
      const body = await schema.validateAsync(req.body)


      var hashedPassword = bcrypt.hashSync(body.password, 8);
      body.password = hashedPassword


      if (data.find(record => record.username === body.username)) {
        result = false
        res.status(400).send(`{
    "result": false,
    "error": "username already exists"
}`);
      } else {
        data.push(body)
        fs.writeFile(dataPath, JSON.stringify(data), function (err) {
          if (err) throw err;

        })
        var token = jwt.sign({
          username: body.username
        }, config.secret);
        result = true
        res.status(200).send(`{
  "result": true,
  "message": "SignUp success. Please proceed to Signin"
}`)
      }
    } catch (err) {
      res.status(400).send(`{
    "result": false,
    "error": "${err.message}"
}`)
    }
  }

  );

  app.post('/signin', (req, res) => {
    const body = req.body;
    if (Object.keys(body).length < 2) {
      res.status(400).send({
        "result": false,
        "error": "Please provide username and password"
      })
    } else {
      try {
        body.username
        body.password
      } catch (err) {
        res.status(400).send({
          "result": false,
          "error": "Please provide username and password"
        })
      }
      try {
        let found = data.find(record => record.username === body.username)
        var passwordIsValid = bcrypt.compareSync(body.password, found.password);
        if (!passwordIsValid) return res.status(401).send({
          auth: false,
          token: null
        });
        var token = jwt.sign({
          username: body.username
        }, config.secret);
        res.status(200).send(`{
    "result": true,
    "jwt": "${token}",
    "message": "Signin success"
}`);
      } catch (err) {
        res.status(401).send({
          "result": false,
          "error": "Invalid username/password"
        })
      }
    }
  });

  app.get('/user/me', function (req, res) {
    let token;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) return res.status(401).send({
      "result": false,
      "error": "Please provide a JWT token"
    });

    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) return res.status(401).send({
        "result": false,
        "error": "JWT Verification Failed"
      });
      let found = data.find(record => record.username === decoded.username)
      res.status(200).send(`{
        "result": true,
        "data": {
          "fname": "${found.fname}",
          "lname": "${found.lname}",
          "password": "${found.password}"
        }
      }`);
    });
  });

  app.get('/users', (req, res) => {
    res.send(data);
  });
};

module.exports = userRoutes;