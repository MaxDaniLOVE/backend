const uuid = require('uuid/v4');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

let  DUMMY_PLACES = [
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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }
  console.log('GET request of place with id ' + placeId);
  const place = DUMMY_PLACES.find(({id}) => id === placeId);

  if (!place) {
    throw new HttpError('Couldn\'t find provided id', 404);
  }

  res.json({place});
}

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid; // { uid: 'u1' }
  console.log('GET request of user with id ' + userId);
  const place = DUMMY_PLACES.filter(({creator}) => creator === userId);

  if (!place || !place.length) {
    return next(new HttpError('Couldn\'t find places of user', 404));
  }

  res.json({place});
}

const createPlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalids inputs passed', 422)
  }
  const { title, description, coordinates, address, creator } = req.body
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator
  }
  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({place: createdPlace})
}

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
 
  if (!errors.isEmpty()) {
    console.log(errors.isEmpty)
    throw new HttpError('Invalids inputs passed', 422)
  }
  const placeId = req.params.pid; // { pid: 'p1' }
  const { title, description } = req.body;
  const updatePlace = { ...DUMMY_PLACES.find(({id}) => id === placeId) };
  const placeIdx = DUMMY_PLACES.findIndex(({id}) => id === placeId);
  updatePlace.title = title;
  updatePlace.description = description;

  DUMMY_PLACES[placeIdx] = updatePlace;

  res.status(200).json({place: updatePlace})
}

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }
  if (!DUMMY_PLACES.find(({id}) => id === placeId)) {
    throw new HttpError('Could not find place for that id.', 404)
  }
  DUMMY_PLACES = DUMMY_PLACES.filter(({id}) => id !== placeId)
  res.status(200).json({places: DUMMY_PLACES})
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.deletePlace = deletePlace;
exports.updatePlace = updatePlace;