const uuid = require('uuid/v4');
const HttpError = require('../models/http-error')

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

const signup = (req, res, next) => {
  const { name, email, password } = req.body;
  const hasUser = DUMMY_USERS.find(user => user.email === email);
  if (hasUser) {
    throw new HttpError('User already created', 422)
  }
  const newUser = {
    id: uuid(),
    name,
    email,
    password
  }
  DUMMY_USERS.push(newUser);
  res.status(201);
  res.json({user: newUser})
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