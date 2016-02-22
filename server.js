'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'jade');
//middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  if (req.body.password === req.body.verify){
    res.redirect('/login');
  } else {
    res.render('register', {
      message: 'Passwords do not match',
      email: req.body.email});
  }
});

app.post('/login', (req, res) => {
  res.redirect('/');
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
