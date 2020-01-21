const path = require('path');

/**
 * Default name of the service
 * @type {String}
 */
exports.name = 'example';

/**
 * Enables plugins. This is a minimum list
 * @type {Array}
 */
exports.plugins = [
  'router',
  'http',
  'amqp',
  'validator',
  'logger',
];
/**
 * Bunyan logger configuration
 * @type {Boolean}
 */
exports.logger = {
  name: '@microfleet/html-to-pdf',
  defaultLogger: true,
  debug: process.env.NODE_ENV !== 'production',
};
/**
 * Local schemas for validation
 * @type {Array}
 */
exports.validator = {
  schemas: [path.resolve(__dirname, '../../schemas')],
  ajv: {
    $meta: 'ms-validation AJV schema validator options',
  },
};

/**
 * @type {Object}
 */
exports.accessTokens = {
  secret: {
    $filter: 'env',
    $default: 'dajskd12r1987das071241d-ar-01248120d7as-d98ays',
    // NOTE: MAKE SURE TO SET THIS IN PRODUCTION
    production: '',
  },
};
