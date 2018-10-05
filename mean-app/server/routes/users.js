// library imports
const express = require('express');
const router = express.Router();

// project imports
const userController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');
const checker = checkAuth.checker;

// routes
router.get('/autologin', checker, userController.tryAutoLogin);
router.post('/signup', userController.createUser);
router.post('/login', userController.loginUser);

module.exports = router;
