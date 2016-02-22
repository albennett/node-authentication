'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const BCRYPT_DIFFICULTY = 11;

const UserSchema = new mongoose.Schema({
  email: String,
  hashedPassword: String
});

UserSchema
  .virtual('password')
  .set(function (p) { this._p = p })
  .get(function () { return this._p})

UserSchema.pre('save', function (next) {
  bcrypt.hash(this.password, BCRYPT_DIFFICULTY, (err, hash) => {
    console.log(this, this.password, BCRYPT_DIFFICULTY);

    if (err) throw err;

    this.hashedPassword = hash;
    next();
  });
});

module.exports = mongoose.model('Users', UserSchema);
