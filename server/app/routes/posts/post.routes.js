// library imports
const express = require('express');

// project imports
const postsController = require('./post.controller');
const checkAuth = require('../../middleware/check-auth').checker;
const extractFile = require('../../middleware/file');

// routes
const router = express.Router();
router.get('/:id', postsController.getPost);
router.get('', postsController.getPosts);
router.post('', checkAuth, extractFile, postsController.createPost);
router.put('/:id', checkAuth, extractFile, postsController.updatePost);
router.delete('/:id', checkAuth, postsController.deletePost);

module.exports = router;
