var express = require('express');
var router = express.Router();
var models = require('../models'); //<--- Add models
var authService = require('../services/auth'); //<--- Add authentication service

router.post('/token', function (req, res, next) {
  let token = req.cookies.token;

  if(!token){
    res.json({user: null, token: null});
    return;
  }
  authService.verifyUser(token).then(user => {

    if(!user){
      res.json({user: null, token: null})
    }

    let token = authService.signUser(user);
    res.cookie('token', token, { httpOnly: true });
    res.json({user, token})
  });
});

router.post('/signup', function (req, res, next) {
  models.users
    .findOrCreate({
      where: {
        email: req.body.email,
      },
      defaults: {
        password: authService.hashPassword(req.body.password) 
      }
    })
    .spread(function (result, created) {
      res.json({created})
    });
});

// Login user and return JWT as cookie
router.post('/login', function (req, res, next) {
  console.log(req.body)


  models.users.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {

    console.log(user)
    if (!user) {
      return res.json({
        message: "Email and Password did not match any records. 1"
      });
    } else {
      let passwordMatch = authService.comparePasswords(req.body.password, user.password);
      if (passwordMatch) {
        let token = authService.signUser(user);
        res.cookie('token', token, { httpOnly: true });
        res.json({user, token})
      } else {
        res.json({message: "Email and Password did not match any records."})
      }
    }
  });
});

router.post("/logout", (req, res) => {
  res.cookie('token', '', {expires: new Date(0)});
  res.json({message: "User logged out."})
})

module.exports = router;