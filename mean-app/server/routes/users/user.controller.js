const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./user.model');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: 'User created!',
          payload: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'Invalid Authentication Credentials!',
          payload: err
        });
      });
  });
};

exports.loginUser = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Invalid Credentials: Check email.',
          payload: null
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Invalid Credentials: Check password.',
          payload: null
        });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id
        },
        process.env.JWT_KEY,
        { expiresIn: '1h' }
      );
      res.status(200).json({
        message: 'Authenticated!',
        payload: { token, expiresIn: 3600, userId: fetchedUser._id }
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Invalid Authentication Credentials!',
        payload: err
      });
    });
};

exports.tryAutoLogin = (req, res, next) => {
  res.status(200).json({ message: 'auto login success', payload: true });
};
