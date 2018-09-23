// library imports
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// project imports
const User = require('../models/user');

// code
const router = express.Router();

// middleware

// routes

// get
// post
router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: 'user created',
          payload: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'failure',
          payload: err
        });
      });
  });
});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'auth failed',
          payload: 'email not found'
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'auth failed',
          payload: 'password error'
        });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id
        },
        'this is a long passphrase thats hard to guess',
        { expiresIn: '1h' }
      );
      res.status(200).json({
        message: 'auth success',
        payload: token
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'auth failed',
        payload: err
      });
    });
});
// put
// delete

module.exports = router;
