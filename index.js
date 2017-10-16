'use strict';

var request = require('request');
var natural = require('natural');

function CallByMeaning(host) {
  if (!(this instanceof CallByMeaning)) {
    return new CallByMeaning(host);
  }
  this.host = host || 'https://call-by-meaning.herokuapp.com';
}

CallByMeaning.prototype.fullAddress = function (path) {
  var address = '';
  address += this.host;
  address += path;
  return address;
};

CallByMeaning.prototype.lookup = function () {
  var args = arguments;
  var nargs = args.length;
  var uri, type, callback;

  if (nargs < 2) {
    throw new Error('Insufficient input arguments. Must provide a CallByMeaning URI and a callback function.');
  }

  uri = args[0];
  if (!(typeof uri === 'string')) {
    throw new TypeError('Invalid input argument. First argument must be a string primitive. Value: `' + uri + '`.');
  }
  if (nargs < 3) {
    type = 'all';
    callback = args[1];
  } else {
    type = args[1];
    if ((!(typeof uri === 'string') || (['c', 'f', 'r'].indexOf(type) === -1))) {
      throw new TypeError('Invalid input argument. type argument must be one of \'c\', \'f\', \'r\'. Value: `' + type + '`.');
    }
    callback = args[2];
  }

  if (!(callback instanceof Function)) {
    throw new TypeError('Invalid input argument. Last argument must be a callback function. Value: `' + callback + '`.');
  }

  if (type !== 'all') {
    let path = '/gbn/' + type + '/' + String(encodeURIComponent(uri));
    request.get({uri: this.fullAddress(path), json: true}, function (err, response, body) {
      return callback(err, response, body);
    });
  } else {
    var path_c = this.fullAddress('/gbn/' + 'c' + '/' + String(encodeURIComponent(uri)));
    var path_f = this.fullAddress('/gbn/' + 'f' + '/' + String(encodeURIComponent(uri)));
    var path_r = this.fullAddress('/gbn/' + 'r' + '/' + String(encodeURIComponent(uri)));
    request.get({uri: path_c, json: true}, function (err, response, body) {
      if (response.statusCode === 200) return callback(err, response, body);
      request.get({uri: path_f, json: true}, function (err, response, body) {
        if (response.statusCode === 200) return callback(err, response, body);
        request.get({uri: path_r, json: true}, function (err, response, body) {
          if (response.statusCode === 200) {
            return callback(err, response, body);
          } else {
            body = 'Couldn\'t find that in DB.';
            response.body = body;
            return callback(err, response, body);
          }
        });
      });
    });
  }
};

CallByMeaning.prototype.getURI = function () {
  var args = arguments;
  var nargs = args.length;
  var text;
  if (nargs !== 1) {
    throw new Error('Invalid input arguments. Must provide only an input text.');
  }
  text = args[0];
  if (!(typeof text === 'string')) {
    throw new TypeError('Invalid input argument. Argument must be a string primitive. Value: `' + text + '`.');
  }
  text = text.replace(/[^\w\d\s]/g, '');
  let tokenizer = natural.WordTokenizer();
  let stemmed = tokenizer.tokenize(text);
  stemmed = stemmed.filter(function (item) {
    return (item !== 'a') && (item !== 'the') && (item !== 'an');
  });
  return stemmed.join('_');
};

CallByMeaning.prototype.search = function () {
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

  var path = this.fullAddress('/gbm/search/');
  request.post({uri: path, form: params, json: true}, function (err, response, body) {
    return callback(err, response, body);
  });
};

CallByMeaning.prototype.call = function () {
  var args = arguments;
  var nargs = args.length;
  var params;
  var callback;
  var returnCode = false;

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

  var path = this.fullAddress('/cbm/call/');
  request.post({uri: path, headers: {returncode: returnCode}, form: params, json: true}, function (err, response, body) {
    return callback(err, response, body);
  });
};

CallByMeaning.prototype.getCode = function () {
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
  var path = this.fullAddress(codeFile.substring(1));
  var callback = args[1];
  if (!(callback instanceof Function)) {
    throw new TypeError('Invalid input argument. Last argument must be a callback function. Value: `' + callback + '`.');
  }

  request.get(path, function (err, response, body) {
    return callback(err, body);
  });
};

module.exports = CallByMeaning;