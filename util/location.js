const axios = require('axios');
const HttpError = require('../models/http-error')

const API_KEY = 'bf110a0649d865';

async function getCoordsForAddress(address) {
  const url = `https://eu1.locationiq.com/v1/search.php?key=${API_KEY}&q=${address}&format=json`
  const response = await axios
    .get(url)
    .catch(err => {
      throw new HttpError('Could not find place', err.response.status)
    });
  const data = response.data;
  return {
    lat: data[0].lat,
    lng: data[0].lon
  }
}

module.exports = getCoordsForAddress;