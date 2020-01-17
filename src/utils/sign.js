const hmac = require('jwa')('HS256');
const config = require('../config');

exports.sign = function sign(payload) {
  return hmac.sign(payload, config.accessTokens.secret);
};

exports.verify = function verify(payload, signature) {
  return hmac.verify(payload, signature, config.accessTokens.secret);
};
