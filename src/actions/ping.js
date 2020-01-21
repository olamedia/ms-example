const { ActionTransport } = require('@microfleet/core');

function pingAction() {
  // console.log(this.amqp);
  this.amqp.publishAndWait('collect', {
    client_id: 'ba21e63e-659a-43fd-a2d0-26735870de8d',
    action: 'overlay open',
    subject: 'overlay x',
    device: 'phone',
    event_date: '2020-01-09',
  })
    .reflect()
    .then((response) => {
      console.log(response);
      return null;
    });
  return 'pong';
}

module.exports = pingAction;
pingAction.transports = [ActionTransport.http];
