/**
 * Specifies configuration for AMQP / RabbitMQ lib
 * @type {Object} amqp
 */
exports.amqp = {
  transport: {
    queue: 'ms-example',
    connection: {
      host: 'rabbitmq',
      login: 'ms-example',
      password: 'ms-example',
    },
  },
  router: {
    enabled: true,
  },
};
