const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Maks Danilau',
    email: 'maks.danilau@gmail.com',
    password: 'test1234'
  }
]

const getUsers = (req, res, next) => {
  res.status(200);
  res.json({users: DUMMY_USERS}) //res.status(202).json({users: DUMMY_USERS})
}

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalids inputs passed', 422));
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    const err = new HttpError('Try again.', 500);
    return next(err);
  }

  if (existingUser) {
    const err = new HttpError('User exists already.', 422);
    return next(err);
  }
   
  const newUser = new User({
    name,
    email,
    password,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Vladimir_Putin_%282020-02-20%29.jpg/1200px-Vladimir_Putin_%282020-02-20%29.jpg',
    places: 'sdasd'
  })
  
  try {
    await newUser.save()
  } catch (err) {
    const error = new HttpError('Signing up failed', 500);
    return next(error);
  }

  res.status(201);
  res.json({user: newUser.toObject({getters: true})})
}

const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find(user => user.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError('Could not identify user.', 401)
  }
  res.status(200);
  res.json({message: 'logged in'})
  
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;