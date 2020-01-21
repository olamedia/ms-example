const { Microfleet, ConnectorsTypes } = require('@microfleet/core');
const { PluginHealthCheck } = require('@microfleet/core/lib/utils/pluginHealthStatus');
const merge = require('lodash/merge');
const debug = require('debug');


module.exports = class ExampleService extends Microfleet {
    static defaultOpts = require('./config').get('/', { env: process.env.NODE_ENV });


    constructor(opts = {}) {
      super(merge({}, ExampleService.defaultOpts, opts));
      /* super({
        name: 'example',
        router: {
          extensions: { register: [] }, // this line disables some core features that we don't need yet
        },
      }); */

      // config
      const { config } = this;

      this.on('plugin:connect:amqp', (amqp) => {
        console.log('AMQP connected');
      });

      this.on('plugin:start:amqp', () => {
        console.log('AMQP started');
      });
      this.on('plugin:start:http', () => {
        console.log('HTTP started');
      });
    }
};
