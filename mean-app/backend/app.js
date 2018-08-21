const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect('mongodb://max_mean:max123mean@127.0.0.1:27017/max-mean').then(
  response => {
    console.log('Connected to MongoDB!');
  },
  error => {
    console.log('MongoDB connection failure!');
  }
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.use(bodyparser.json());

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  // console.log(post);
  res.status(201).json({ msg: 'success' });
});

app.use('/api/posts', (req, res, next) => {
  Post.find(posts => {});

  const posts = [
    {
      id: '156asd1f65sdaf5',
      title: 'First',
      details: 'This is the askjdfak j khkjhasf  lskajh saklfjda.'
    },
    {
      id: '156asdfsaf5',
      title: 'Second',
      details: 'This is the askjd4356758985678562kajh saklfjda.'
    },
    {
      id: '156a24353245daf5',
      title: 'Third',
      details: 'This iaasdfw34534564356f  lskajh saklfjda.'
    }
  ];
  res.status(200).json({
    msg: 'success',
    data: posts
  });
});

module.exports = app;
