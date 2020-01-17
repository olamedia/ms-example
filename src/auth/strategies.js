const jwt = require('./jwt');
const jwtIsAdmin = require('./jwtIsAdmin');

/**
 * Exports available auth strategies
 * @type {Object}
 */
module.exports = {
  jwt,
  jwtIsAdmin,
};
