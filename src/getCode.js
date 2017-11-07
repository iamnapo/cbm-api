'use strict';

var request = require('request');

function getCode() {
  var args = arguments;
  var nargs = args.length;
  var codeFile;

  if (nargs < 2) {
    throw new Error('Insufficient input arguments. Must provide a path and a callback function.');
  }

  codeFile = args[0];
  if (!(typeof codeFile === 'string')) {
    throw new TypeError('Invalid input argument. First argument must be a string primitive. Value: `' + codeFile + '`.');
  }

  var path;
  if (codeFile.indexOf('/js') > -1 || codeFile.indexOf('/internal') > -1) {
    path = this._fullAddress(codeFile.substring(1));
  } else {
    path = codeFile[0] === '_' ? this._fullAddress('/js/internal' + codeFile) : this._fullAddress('/js/' + codeFile);
  }

  var callback = args[1];
  if (!(callback instanceof Function)) {
    throw new TypeError('Invalid input argument. Last argument must be a callback function. Value: `' + callback + '`.');
  }

  request.get(path, function (err, response, body) {
    callback(err, String(body), response.statusCode);
  });
}

module.exports = getCode;