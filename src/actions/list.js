const { ActionTransport } = require('@microfleet/core');
const merge = require('lodash/merge');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const clickhouseRequest = require('../utils/clickhouse-request');

const defaults = {
  start_date: null,
  end_date: null,
  slice: null,
  device: null,
};

function listAction({ params }) {
  const service = this;
  const { config } = this;

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
    clickhouseRequest().query(`SELECT event_date, count(id) as count FROM all_hits ${whereSql} GROUP BY event_date FORMAT JSON`)
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
    clickhouseRequest().query(`SELECT device, count(id) as count FROM all_hits ${whereSql} GROUP BY device FORMAT JSON`)
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
    clickhouseRequest().query(`SELECT MAX(num) as count FROM (SELECT subject, count(id) as num FROM all_hits ${whereSql} GROUP BY subject) y FORMAT JSON`)
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
// listAction.allowed = (request, action, router) => {
//   return new Promise((resolve, reject) => {
//     // Authorization: Bearer <token>
//     if (!('authorization' in request.headers)) {
//       return reject(new Error('access denied'));
//     }
//     const authHeader = request.headers.authorization;
//     const [tokenType, token] = authHeader.split(' ');
//     if (tokenType !== 'Bearer') {
//       return reject(new Error(`unknown authorization method ${tokenType}`));
//     }
//     console.log(`jwt token = ${token}`);
//     console.log(this.config);
//     console.log(request, action, router);
//     console.log(`secret = ${config.accessTokens.secret}`);
//     if (!jwt.verify(token, config.accessTokens.secret, config.jwt)) {
//       return reject(new Error('jwt token verification failed'));
//     }
//
//     return resolve('access granted');
//   });
// };// Promise.reject('access denied');

listAction.auth = 'jwtIsAdmin';
listAction.transports = [ActionTransport.http];
