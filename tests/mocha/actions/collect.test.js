const { describe, it, beforeEach } = require('mocha');
const { RequestError, StatusCodeError } = require('request-promise/errors');
const { assert } = require('chai');// require('assert');
const requestPromise = require('request-promise');
const uuid = require('uuid/v4');
const clickhouseRequest = require('../../../src/utils/clickhouse-request');

describe('Collect action', () => {
  beforeEach(() => {
    return clickhouseRequest().query(`
        CREATE TABLE IF NOT EXISTS all_hits (
  id UInt64,
  client_id UUID,
  action String,
  subject String,
  device String,
  event_date Date,
  created_at DateTime
) ENGINE = MergeTree(event_date, (id, event_date), 8192)
        `);
  });

  describe('HTTP POST /collect', () => {
    it('Should insert data', () => {
      const data = {
        client_id: uuid(),
        event_date: '2020-01-09',
      };
      return requestPromise({
        uri: 'http://ms-example:3000/collect',
        method: 'POST',
        body: `${JSON.stringify(data)}`,
        resolveWithFullResponse: true,
      })
        .then(() => {
          return clickhouseRequest().query(`SELECT client_id, event_date FROM all_hits WHERE client_id = '${data.client_id}' FORMAT JSON`)
            .then((response) => {
              const actualResult = JSON.parse(response.body).data[0];

              assert.equal(actualResult.client_id, data.client_id);
              assert.equal(actualResult.event_date, data.event_date);

              return response;
            });
        });
    });

    it('Should not insert invalid data', () => {
      const data = {
        client_id: uuid(),
        event_date: '2020x01-09-x',
      };
      return requestPromise({
        uri: 'http://ms-example:3000/collect',
        method: 'POST',
        body: `${JSON.stringify(data)}`,
        resolveWithFullResponse: true,
      })
        .then(() => {
          assert.fail('Should return error');
        })
        .catch(StatusCodeError, (reason) => {
          const body = JSON.parse(reason.response.body);
          assert.equal(body.statusCode, 400);

          return clickhouseRequest().query(`SELECT client_id, event_date FROM all_hits WHERE client_id = '${data.client_id}' FORMAT JSON`)
            .then((response) => {
              const actualResult = JSON.parse(response.body);

              assert.equal(actualResult.rows, 0);
              assert.isEmpty(actualResult.data, []);

              return response;
            });
        });
    });
  });
});
