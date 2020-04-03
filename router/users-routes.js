const express = require('express');

const usersControlers = require('../controlers/users-controlers')

const router = express.Router();

router.get('/', usersControlers.getUsers);

router.post('/signup', usersControlers.signup);

router.post('/login', usersControlers.login);

module.exports = router;
