const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use('/', (res, req, next) => {
  req.send('Hello world!');
})

app.listen(5000, () => {
  console.log('http://localhost:5000/')
})