
const requestPromise = require('request-promise');
const merge = require('lodash/merge');

class ClickhouseRequest {
  constructor(uri) {
    // FIXME extract default URI to .env file
    this.uri = uri || 'http://clickhouse:8123/';
  }

  query(sql, requestOptions) {
    return requestPromise(merge(
      {},
      {
        uri: this.uri,
        method: 'POST',
        body: sql,
        resolveWithFullResponse: true,
      },
      requestOptions || {}
    ));
  }
}

module.exports = function clickhouseRequest() {
  return new ClickhouseRequest();
};
