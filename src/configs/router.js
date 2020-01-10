const path = require('path');
const { routerExtension, ActionTransport } = require('@microfleet/core');

const { http } = ActionTransport;

/**
 * This extension defaults schemas to the name of the action
 * @type {Function}
 */
const autoSchema = routerExtension('validate/schemaLessAction');

/**
 * Provides audit log for every performed action
 * @type {Function}
 */
const auditLog = routerExtension('audit/log');

/**
 * Prometheus metrics
 */
//const metrics = routerExtension('audit/metrics');

/**
 * Specifies configuration for the router of the microservice
 * @type {Object}
 */
exports.router = {
  routes: {
    directory: path.resolve(__dirname, '../actions'),
    //setTransportsAsDefault: false,
    //transports: [http],
    //prefix: 'example-prefix',
    //enabledGenericActions: ['health'],
  },
  extensions: {
    enabled: ['postRequest', 'preRequest', 'preResponse', 'postResponse'],
    //register: [], metrics()
    register: [autoSchema, auditLog()],
  },
};
