const express = require('express');
const { check } = require('express-validator')

const usersControlers = require('../controlers/users-controlers')

const router = express.Router();

router.get('/', usersControlers.getUsers);

router.post('/signup', [
  check('name')
    .not()
    .isEmpty(),
  check('email')
    .normalizeEmail()
    .isEmail(),
  check('password')
    .isLength({min: 8})
  ],
  usersControlers.signup);

router.post('/login', usersControlers.login);

module.exports = router;
