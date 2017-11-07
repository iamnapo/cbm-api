'use strict';

var request = require('request');

function search() {
  var args = arguments;
  var nargs = args.length;
  var params;
  var callback;

  if (nargs < 2) {
    throw new Error('Insufficient input arguments. Must provide a params object and a callback function.');
  }
  params = args[0];
  if (typeof params !== 'object' || params == null) {
    throw new TypeError('Invalid input argument. Argument must be an object.');
  }

  callback = args[1];
  if (!(callback instanceof Function)) {
    throw new TypeError('Invalid input argument. Last argument must be a callback function. Value: `' + callback + '`.');
  }

  var path = this._fullAddress('/gbm/search/');
  request.post({uri: path, form: params, json: true}, function (err, response, body) {
    let result = body.map(function (obj) {
      let temp = {
        function: obj.function.split('/').pop(),
        description: obj.desc
      };
      return temp;
    });
    callback(err, result, response.statusCode);
  });
}

module.exports = search;