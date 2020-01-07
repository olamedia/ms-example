const { ActionTransport } = require('@microfleet/core');

function addAction() {
  return 'Hello, world!\n';
}

module.exports = addAction;
addAction.transports = [ActionTransport.http];
