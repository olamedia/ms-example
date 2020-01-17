const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const { ActionTransport } = require('@microfleet/core');

module.exports = function jwtAuth(request) {
  if (request.transport !== ActionTransport.http) {
    return Promise.reject(new Error('HTTP transport allowed only'));
  }

  if (!('authorization' in request.headers)) {
    return Promise.reject(new Error('access denied'));
  }

  const authHeader = request.headers.authorization;

  const [authMethod, token] = authHeader.trim().split(/\s+/, 2).map((str) => str.trim());

  if (authMethod !== 'Bearer') {
    return Promise.reject(new Error(`unknown authorization method ${authMethod}`));
  }

  const { config } = this;

  const {
    defaultAudience, hashingFunction, issuer, ttl,
  } = config.jwt;

  const tokenData = jwt.decode(token, { complete: true });

  console.log(tokenData);

  const jwtSecret = config.jwt.secret;

  const jwtVerifyOptions = {
    algorithms: [hashingFunction],
    audience: defaultAudience,
    issuer,
    ignoreExpiration: true,
    maxAge: ttl,
  };

  const jwtSignOptions = {
    algorithm: hashingFunction,
    expiresIn: '12h',
    audience: defaultAudience,
    issuer,
  };

  const signedToken = jwt.sign(tokenData, jwtSecret, jwtSignOptions);

  console.log({ signedToken });

  if (!jwt.verify(token, jwtSecret, jwtVerifyOptions)) {
    return Promise.reject(new Error('jwt token verification failed'));
  }

  return Promise.resolve(tokenData);
};
