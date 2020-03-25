const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./router/place-routes');

const app = express();

app.use('/api/places', placesRoutes);

app.listen(5000, () => {
  console.log('http://localhost:5000/')
})