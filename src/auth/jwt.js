const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const { ActionTransport } = require('@microfleet/core');

module.exports = (request) => {
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
  // const { users: { audience: defaultAudience, verify, timeouts } } = config;
  // const timeout = timeouts.verify;


  console.log(`jwt token = ${token}`);
  console.log(this, config);
  console.log(`secret = ${config.accessTokens.secret}`);

  if (!jwt.verify(token, config.accessTokens.secret, config.jwt)) {
    return Promise.reject(new Error('jwt token verification failed'));
  }

  return Promise.resolve('access granted');
};
