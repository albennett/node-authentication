const express = require('express');
const router = express.Router();

const User = require('./model');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  User.findOne({email: req.body.email}, (err, user) => {
    if (err) throw err;

    if (user) {
      user.authenticate(req.body.password, (err, valid) => {
        if (err) throw err;

        if (valid) {
          req.session.user = user;
          res.redirect('/');
        } else {
          res.redirect('/login');
        }
      })
    } else {
      res.redirect('/login');
    }
  });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.delete('/login', (req,res) => {
  req.session.regenerate(function(err) {
  // will have a new session here
    if (err) throw err;
    res.redirect('/')
  });
});

router.post('/register', (req, res) => {
  if (req.body.password === req.body.verify) {
    User.findOne({email: req.body.email}, (err, user) => {
      if (err) throw err;

      if (user) {
        res.redirect('/login');
      } else {
        User.create(req.body, (err) => {
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
