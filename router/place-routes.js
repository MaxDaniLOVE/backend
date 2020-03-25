const express = require('express');

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Озеро Нарочь',
    description: ':)',
    location: {
      lat: 54.8560698,
      lng: 26.629201
    },
    address: 'Narach Lake',
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Maksim Bahdanovič Museum',
    description: ':)',
    location: {
      lat: 53.9079756,
      lng: 27.5557012
    },
    address: 'vulica Maksima Bahdanoviča 7а, Minsk',
    creator: 'u2',
  },
]

router.get('/:pid', (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }
  console.log('GET request of place with id ' + placeId);
  const place = DUMMY_PLACES.find(({id}) => id === placeId);
  res.json({place});
});

router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid; // { uid: 'u1' }
  console.log('GET request of user with id ' + userId);
  const place = DUMMY_PLACES.find(({creator}) => creator === userId);
  res.json({place});
})

module.exports = router;