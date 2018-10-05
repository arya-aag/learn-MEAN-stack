// library imports
const express = require('express');
const multer = require('multer');
const router = express.Router();

// project imports
const postsController = require('../controllers/post');
const checkAuth = require('../middleware/check-auth').checker;

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
router.get('/:id', postsController.getPost);
router.get('', postsController.getPosts);
router.post(
  '',
  checkAuth,
  multer({ storage: storage }).single('image'),
  postsController.createPost
);
router.put(
  '/:id',
  checkAuth,
  multer({ storage: storage }).single('image'),
  postsController.updatePost
);
router.delete('/:id', checkAuth, postsController.deletePost);

module.exports = router;
