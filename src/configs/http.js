/**
 * Specifies configuration for the http interface
 * @type {Object}
 */
exports.http = {
  server: {
    handler: 'hapi',
    port: 3000,
    handlerConfig: {
      server: {
        routes: {
          cors: {
            additionalHeaders: ['accept-language', 'x-xsrf-token'],
            origin: ['*'],
            credentials: false,
          },
        },
      },
    },
  },
  router: {
    enabled: true,
    prefix: 'api',
  },
};
