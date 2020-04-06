const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error')

const placesRoutes = require('./router/place-routes');
const usersRoutes = require('./router/users-routes');
const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  throw new HttpError('Couldn\'t find this route', 404)
})

app.use((err, req, res, next) => {
  if (res.headerSent) {
    return next(err)
  }
  res.status(err.code || 500);
  res.json({message: err.message || 'An unknown error'})
})

const url = 'mongodb+srv://maks_danilau:134679258@cluster0-wvi2c.mongodb.net/places?retryWrites=true&w=majority';

mongoose
  .connect(url)
  .then(() => {
    app.listen(5000, () => {
      console.log('http://localhost:5000/')
    })
  })
  .catch(err => {
    console.log(err)
  })

