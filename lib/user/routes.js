const express = require('express');
const router = express.Router();

const User = require('./model');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  User.findOne({email: req.body.email}, (err, user)=> {
    if (err) throw err;
    req.session.user = user;
    res.redirect('/');
  })
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  if (req.body.password === req.body.verify) {
    User.findOne({email: req.body.email}, (err, user) => {
      if(err) throw err;
      if (user) {
        res.redirect('/login');
      } else {
        //register, then redirect
        User.create(req.body, (err)=> {
          if (err) throw err;
          res.redirect('/login');
        });
      }
    });
  } else {
    res.render('register', {
      email: req.body.email,
      message: 'Passwords do not match'
    });
  }
});

module.exports = router;
