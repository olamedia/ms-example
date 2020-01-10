const { describe, it, beforeEach } = require('mocha');

const { assert } = require('chai');// require('assert');
// const { RequestError } = require('request-promise/errors');
const clickhouseRequestTest = require('../../../src/utils/clickhouse-request');

describe('Clickhouse request', () => {
  beforeEach(() => {
    return clickhouseRequestTest().query('DROP TABLE IF EXISTS test')
      .then(() => {
        return clickhouseRequestTest().query('CREATE TABLE test (id UInt64, date Date) ENGINE=MergeTree(date,(id, date),8128)');
      });
  });

  describe('#query()', () => {
    it('Should execute sql', () => {
      return clickhouseRequestTest().query('INSERT INTO test (id) VALUES (1)')
        .then(() => {
          return clickhouseRequestTest().query('SELECT * FROM test WHERE id = 1')
            .then((response) => {
              // console.log(response);
              assert.equal(response.body, '1\t0000-00-00\n');
              return response;
            });
        });
    });
  });
});
