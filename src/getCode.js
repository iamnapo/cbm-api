/* eslint no-invalid-this: "off" */

'use strict';

const request = require('request');

function getCode(...args) {
  let nargs = args.length;
  let codeFile;

  if (nargs < 2) {
    throw new Error('Insufficient input arguments. Must provide a path and a callback function.');
  }

  codeFile = args[0];
  if (!(typeof codeFile === 'string')) {
    throw new TypeError('Invalid input argument. First argument must be a string primitive. Value: `' + codeFile + '`.');
  }

  let path;
  if (codeFile.indexOf('/js') > -1 || codeFile.indexOf('/internal') > -1) {
    path = this.fullAddress_(codeFile.substring(1));
  } else {
    path = codeFile[0] === '_' ? this.fullAddress_('/js/internal' + codeFile) : this.fullAddress_('/js/' + codeFile);
  }

  let callback = args[1];
  if (!(callback instanceof Function)) {
    throw new TypeError('Invalid input argument. Last argument must be a callback function. Value: `' + callback + '`.');
  }

  request.get(path, (err, response, body) => {
    callback(err, String(body), response.statusCode);
  });
}

module.exports = getCode;