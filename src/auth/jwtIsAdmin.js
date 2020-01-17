const Promise = require('bluebird');
const jwtAuth = require('./jwt');

module.exports = function jwtIsAdminAuth(request) {
  return jwtAuth.call(this, request).then((tokenData) => {
    const { payload: { isAdmin } } = tokenData;
    if (isAdmin === true) {
      return Promise.resolve(tokenData);
    }
    return Promise.reject(new Error('Required admin rights'));
  });
};
