const express = require('express');

const placesControlers = require('../controlers/places-controlers')

const router = express.Router();

router.get('/:pid', placesControlers.getPlaceById);

router.get('/user/:uid', placesControlers.getPlaceByUserId);

router.post('/', placesControlers.createPlace);

module.exports = router;