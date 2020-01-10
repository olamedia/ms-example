const { ActionTransport } = require('@microfleet/core');

function pingAction() {
  return 'pong';
}

module.exports = pingAction;
pingAction.transports = [ActionTransport.http];
