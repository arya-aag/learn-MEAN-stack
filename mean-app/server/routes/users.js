// library imports
const express = require('express');

// project imports
const userController = require('../controllers/user');
const checker = require('../middleware/check-auth').checker;

// routes
const router = express.Router();
router.get('/autologin', checker, userController.tryAutoLogin);
router.post('/signup', userController.createUser);
router.post('/login', userController.loginUser);

module.exports = router;
