// Here is the part where the MySQL connection values are stored.

// config.js dosyası
require('dotenv').config({path: './config.env'});

const translateConfig = {
  key: process.env.TRANSLATE_KEY,
  endpoint: process.env.TRANSLATE_ENDPOINT,
  location: process.env.TRANSLATE_LOCATION,
};

module.exports = translateConfig;

