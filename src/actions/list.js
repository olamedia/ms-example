const { ActionTransport } = require('@microfleet/core');
const merge = require('lodash/merge');
const Promise = require('bluebird');
const clickhouseRequest = require('../utils/clickhouse-request');


const defaults = {
  start_date: null,
  end_date: null,
  slice: null,
  device: null,
};

function listAction({ params }) {
  const service = this;

  const fixedParams = merge({}, defaults, params);

  const startDate = fixedParams.start_date;
  const endDate = fixedParams.end_date;
  const { device } = fixedParams;

  const { slice } = fixedParams;

  const where = [];
  if (startDate !== null) {
    where.push(`event_date >= '${startDate}'`);
  }
  if (endDate !== null) {
    where.push(`event_date < '${endDate}'`);
  }
  if (device !== null) {
    where.push(`device = '${device}'`);
  }
  const whereSql = where.length ? ` ${where.join(' AND ')}` : '';

  return Promise.all([
    // разбивку по <промежутку - час/день/неделя/тп> между временными рамками - <start_date/end_date> которая отдает количество открытий оверлея типа X
    // SELECT event_date, count(id) as count FROM all_hits WHERE event_date > AND event_date < GROUP BY event_date FORMAT JSON
    clickhouseRequest(`SELECT event_date, count(id) as count FROM all_hits ${whereSql} GROUP BY event_date FORMAT JSON`)
      .then((response) => {
        const summary = JSON.parse(response.headers['x-clickhouse-summary']);
        service.log.debug('body:', response.body);
        service.log.debug('summary:', summary);

        const { data, rows } = JSON.parse(response.body);

        return {
          data,
          rows,
        };
      }),
    // популярность девайсов в промежутке времени между X и Y
    clickhouseRequest(`SELECT device, count(id) as count FROM all_hits ${whereSql} GROUP BY device FORMAT JSON`)
      .then((response) => {
        const summary = JSON.parse(response.headers['x-clickhouse-summary']);
        service.log.debug('body:', response.body);
        service.log.debug('summary:', summary);

        const { data, rows } = JSON.parse(response.body);

        return {
          data,
          rows,
        };
      }),
    // наиболее популярный оверлей у device X
    clickhouseRequest(`SELECT MAX(num) as count FROM (SELECT subject, count(id) as num FROM all_hits ${whereSql} GROUP BY subject) y FORMAT JSON`)
      .then((response) => {
        const summary = JSON.parse(response.headers['x-clickhouse-summary']);
        service.log.debug('body:', response.body);
        service.log.debug('summary:', summary);

        const { data, rows } = JSON.parse(response.body);

        return {
          data,
          rows,
        };
      }),
  ]).then((responses) => {
    [response1, response2, response3] = responses;

    return responses;
  });
}

module.exports = listAction;
listAction.transports = [ActionTransport.http];
