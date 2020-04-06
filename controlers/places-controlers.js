const uuid = require('uuid/v4');
const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location')
const { validationResult } = require('express-validator');
const Place = require('../models/places');

let  DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Озеро Нарочь',
    description: ':))))',
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
    description: ':))))',
    location: {
      lat: 53.9079756,
      lng: 27.5557012
    },
    address: 'vulica Maksima Bahdanoviča 7а, Minsk',
    creator: 'u2',
  },
]

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('Fetching failed', 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Couldn\'t find provided id', 404);
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });  // ! GETTERS
}

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid; // { uid: 'u1' }

  let place;
  try {
    place = await Place.find({creator: userId}, null, () => {});
  } catch (err) {
    const error = new HttpError('Fetching failed', 500);
    return next(error);
  }

  if (!place || place.length === 0) {
    const error = new HttpError('Couldn\'t find provided id', 404);
    return next(error);
  }

  res.json({ place: place.map(e => e.toObject({ getters: true }) )});  // ! USING MAP
}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalids inputs passed', 422));
  }
  const { title, description, address, creator } = req.body;
  let location;

  try { // serever will be stopped if not use try/catch
    location = await getCoordsForAddress(address);
  } catch (error) {
    return next(error); // ! NEXT
  } 
  
  const createdPlace =  new Place({
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Official_portrait_of_Barack_Obama.jpg/274px-Official_portrait_of_Barack_Obama.jpg',
    title,
    description,
    location,
    address,
    creator
  })
  try {
    await createdPlace.save()
  } catch (err) {
    const error = new HttpError('Creating failed', 500);
    return next(error);
  }
  

  res.status(201).json({place: createdPlace})
}

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
 
  if (!errors.isEmpty()) {
    throw new HttpError('Invalids inputs passed', 422)
  }
  const placeId = req.params.pid; // { pid: 'p1' }
  const { title, description } = req.body;
  
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('Fetching failed', 500);
    return next(error);
  }


  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError('Editing failed', 500);
    return next(error);
  }

  res.status(200).json({place: place.toObject({ getters: true })})
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