/**
 * JWT configuration
 * @type {Object}
 */
exports.jwt = {
  audience: 'http://ms-example',
  algorithm: 'HS256',
  issuer: 'ms-example',
  secret: 'i-hope-that-you-change-this-long-default-secret-in-your-app',
  ttl: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
};
