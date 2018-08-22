// library imports
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

// project imports
const postsRoutes = require('./routes/posts');

// code
const app = express();

mongoose.connect('mongodb://max_mean:max123mean@127.0.0.1:27017/max-mean').then(
  response => {
    console.info('Connected to MongoDB!');
  },
  error => {
    console.log('MongoDB connection failure!', error);
  }
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

app.use(bodyparser.json());

app.use('/api/posts', postsRoutes);

module.exports = app;
