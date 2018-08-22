// library imports
const express = require('express');

// project imports
const Post = require('../models/post');

// code
const router = express.Router();

router.post('', (req, res, next) => {
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

router.put('/:id', (req, res, next) => {
  const updatedPost = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({ _id: req.params.id }, updatedPost).then(
    result => {
      console.log(result);
      res.status(200).json({
        message: 'updated',
        payload: result
      });
    },
    error => {
      console.log(error);
      res.status(500).json({
        message: 'failed',
        payload: error
      });
    }
  );
});

router.get('/:id', (req, res, next) => {
  Post.findById({ _id: req.params.id }).then(
    post => {
      if (post) {
        res.status(200).json({
          message: 'found',
          payload: post
        });
      } else {
        res.status(404).json({
          message: 'not-found',
          payload: null
        });
      }
    },
    error => {
      res.status(500).json({
        message: 'failure',
        payload: error
      });
    }
  );
});

router.get('', (req, res, next) => {
  Post.find().then(posts => {
    res.status(200).json({
      message: 'success',
      payload: posts
    });
  });
});

router.delete('/:id', (req, res, next) => {
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

module.exports = router;
