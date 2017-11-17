/* eslint no-invalid-this: "off" */

'use strict';

const request = require('request-promise');

async function search(...args) {
  let nargs = args.length;
  let params;

  if (nargs < 1) {
    throw new Error('Insufficient input arguments. Must provide a params object.');
  }
  params = args[0];
  if (typeof params !== 'object' || params == null) {
    throw new TypeError('Invalid input argument. Argument must be an object.');
  }

  let response = await request.post({uri: this.fullAddress_('/gbm/search/'), form: params, json: true, resolveWithFullResponse: true, simple: false});
  let result = response.body.map((obj) => {
    let temp = {
      function: obj.function.split('/').pop(),
      description: obj.desc,
    };
    return temp;
  });
  response.body = result;
  return response;
}

module.exports = search;