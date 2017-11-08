/* eslint no-invalid-this: "off" */
'use strict';

const request = require('request');
const pipe = require('../lib/jsonfn');

function call(...args) {
  let nargs = args.length;
  let params;
  let callback;
  let returnCode = false;

  if (nargs < 2) {
    throw new Error('Insufficient input arguments. Must provide a params object and a callback function.');
  }
  params = args[0];
  if (typeof params !== 'object' || params == null) {
    throw new TypeError('Invalid input argument. Argument must be an object.');
  }

  if (nargs < 3) {
    callback = args[1];
  } else {
    returnCode = args[1];
    callback = args[2];
  }
  if (!(callback instanceof Function)) {
    throw new TypeError('Invalid input argument. Last argument must be a callback function. Value: `' + callback + '`.');
  }

  let path = this._fullAddress('/cbm/call/');
  let caller = this;
  request.post({uri: path, headers: {returncode: returnCode}, form: params, json: true}, (err, response, body) => {
    if (returnCode) {
      caller.getCode(body.function, callback);
    } else {
      callback(err, pipe.parse(body), response.statusCode);
    }
  });
}

module.exports = call;