/* eslint no-invalid-this: "off" */
'use strict';

const request = require('request-promise');
const JSON = require('../lib/jsonfn');

async function call(...args) {
  let nargs = args.length;
  let params;
  let returnCode = false;

  if (nargs < 1) {
    throw new Error('Insufficient input arguments. Must provide a params object.');
  }
  params = args[0];
  if (typeof params !== 'object' || params == null) {
    throw new TypeError('Invalid input argument. Argument must be an object.');
  }

  if (nargs > 1) returnCode = args[1];

  let response = await request.post({uri: this.fullAddress_('/cbm/call/'), headers: {returncode: returnCode}, form: params, json: true, resolveWithFullResponse: true, simple: false});
  if (returnCode) {
    let result = this.getCode(response.body.function);
    return {body: result, statusCode: response.statusCode};
  } else {
    let result = JSON.parse(response.body);
    return {body: result, statusCode: response.statusCode};
  }
}

module.exports = call;