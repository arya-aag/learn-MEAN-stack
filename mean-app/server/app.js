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
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.use(bodyparser.json());

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(
    result => {
      console.log('created post with id: ' + result._id);
      res.status(201).json({ message: 'created', payload: result['_id'] });
    },
    error => {
      res.status(500).json({ message: 'failed', payload: error });
    }
  );
});

app.get('/api/posts', (req, res, next) => {
  Post.find().then(posts => {
    res.status(200).json({
      msg: 'success',
      data: posts
    });
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  console.log('delete post: ' + req.params['id']);
  Post.deleteOne({ _id: req.params.id }).then(
    result => {
      console.log(result);
      res.status(204).json({ message: 'Post deleted!' });
    },
    error => {
      res.status(500).json({ message: 'Error: ' + error.toString() });
    }
  );
});

module.exports = app;
