// library imports
const express = require('express');
const multer = require('multer');

// project imports
const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth').checker;

// code
const router = express.Router();

// middleware
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid Mime Type');
    if (isValid) {
      error = null;
    }
    cb(error, 'server/images');
  },
  filename: (req, file, cb) => {
    const filename = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, filename + '-' + Date.now() + '.' + ext);
  }
});

// routes

// get
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
  const postQuery = Post.find();
  const pageSize = +req.query.size;
  const pageIndex = +req.query.index;
  if (pageSize && pageIndex >= 0) {
    postQuery.skip(pageSize * pageIndex).limit(pageSize);
  }
  let postsArr = [];
  postQuery
    .then(posts => {
      postsArr = posts;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'success',
        payload: { count, posts: postsArr }
      });
    });
});

// post
router.post(
  '',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename
    });
    post.save().then(
      result => {
        console.log('created post with id: ' + result._id);
        res.status(201).json({ message: 'created', payload: result });
      },
      error => {
        res.status(500).json({ message: 'failed', payload: error });
      }
    );
  }
);

// put
router.put(
  '/:id',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename;
    }
    const updatedPost = new Post({
      _id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      imagePath
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
  }
);

// delete
router.delete('/:id', checkAuth, (req, res, next) => {
  console.log('delete post: ' + req.params['id']);
  Post.deleteOne({ _id: req.params.id }).then(
    result => {
      console.log(result);
      res.status(204).json({
        message: 'Post deleted!',
        payload: req.params['id']
      });
    },
    error => {
      res.status(500).json({
        message: 'failure',
        payload: error
      });
    }
  );
});

module.exports = router;
