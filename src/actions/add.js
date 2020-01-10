const { ActionTransport } = require('@microfleet/core');

function addAction({ params }) {
  return params[0] + params[1];
}

module.exports = addAction;
addAction.transports = [ActionTransport.http];
