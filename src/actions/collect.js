const { ActionTransport } = require('@microfleet/core');

const requestPromise = require('request-promise');

async function collectAction({ params }) {
  // const service = this;

  // should be 1 batch insert per second instead
  return requestPromise({
    uri: 'http://clickhouse:8123/',
    method: 'POST',
    body: `INSERT INTO all_hits FORMAT JSONEachRow ${JSON.stringify(params)}`,
    resolveWithFullResponse: true,
  })
    .then((response) => {
      // let summary = JSON.parse(response.headers['x-clickhouse-summary']);
      // service.log.debug('summary:', summary);
      return response.body;
    });
}

module.exports = collectAction;
collectAction.transports = [ActionTransport.http, ActionTransport.amqp];
