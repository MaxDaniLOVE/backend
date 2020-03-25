const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('GET request')
  res.json({message: 'places request works!'});
})

module.exports = router;