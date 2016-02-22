'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const userRoutes = require('./lib/user/routes');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'secret';

app.set('view engine', 'jade');
//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: SESSION_SECRET,
  store: new RedisStore()
}));
app.use((req, res, next) => {
  req.session.visits = req.session.visits || {};
  req.session.visits[req.url] = req.session.visits[req.url] || 0;
  req.session.visits[req.url]++

  console.log(req.session);
  next();
});
app.use(userRoutes);
app.use((req, res, next) => {
  res.locals.user = req.session.user || { email: 'Guest' };
  next();
});
app.get('/', (req, res) => {
  res.render('index', {user: req.session.user});
});

mongoose.connect('mongodb://localhost:27017/nodeauth', (err) =>{
  if (err) throw err;
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
})

