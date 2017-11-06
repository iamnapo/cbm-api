'use strict';

var request = require('request');
var natural = require('natural');
var pipe = require('./lib/jsonfn');

function CallByMeaning(host) {
  if (!(this instanceof CallByMeaning)) {
    return new CallByMeaning(host);
  }
  this.host = 'https://call-by-meaning.herokuapp.com';
  if (host) this.host = String(host);
}

CallByMeaning.prototype._fullAddress = function (path) {
  return this.host.concat(path);
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
    request.get({uri: this._fullAddress(path), json: true}, function (err, response, body) {
      if (response.statusCode === 200) {
        let result;
        switch (type) {
        case 'c':
          result = {
            name: body.name,
            description: body.desc,
            units: body.units,
            asInput: body.func_arg.map(function (obj) {
              let temp = {
                name: obj.name,
                unit: obj.unitType,
              };
              return temp;
            }),
            asOutput: body.func_res.map(function (obj) {
              let temp = {
                name: obj.name,
                unit: obj.unitType,
              };
              return temp;
            })
          };
          break;
        case 'f':
          result = {
            name: body.name,
            description: body.desc,
            units: body.units,
            argsNames: body.argsNames,
            argsUnits: body.argsUnits,
            returnsNames: body.returnsNames,
            returnsUnits: body.returnsUnits,
            sourceCode: body.codeFile
          };
          break;
        case 'r':
          result = {
            name: body.name,
            description: body.desc,
            connections: body.connects.map(function (obj) {
              var temp = {
                start: obj.start.name,
                end: obj.end.name,
                mathRelation: obj.mathRelation
              };
              return temp;
            })
          };
          break;
        }
        callback(err, result, response.statusCode);
      } else {
        let result = new Object('Couldn\'t find that in DB.'); // keep convention that always an object is returned.
        callback(err, result, response.statusCode);
      }
    });
  } else {
    var path_c = this._fullAddress('/gbn/' + 'c' + '/' + String(encodeURIComponent(uri)));
    var path_f = this._fullAddress('/gbn/' + 'f' + '/' + String(encodeURIComponent(uri)));
    var path_r = this._fullAddress('/gbn/' + 'r' + '/' + String(encodeURIComponent(uri)));
    request.get({uri: path_c, json: true}, function (err, response, body) {
      if (response.statusCode === 200) {
        let result =  {
          name: body.name,
          description: body.desc,
          units: body.units,
          asInput: body.func_arg.map(function (obj) {
            let temp = {
              name: obj.name,
              unit: obj.unitType,
            };
            return temp;
          }),
          asOutput: body.func_res.map(function (obj) {
            let temp = {
              name: obj.name,
              unit: obj.unitType,
            };
            return temp;
          })
        };
        callback(err, result, response.statusCode);
      } else {
        request.get({ uri: path_f, json: true }, function (err, response, body) {
          if (response.statusCode === 200) {
            let result = {
              name: body.name,
              description: body.desc,
              units: body.units,
              argsNames: body.argsNames,
              argsUnits: body.argsUnits,
              returnsNames: body.returnsNames,
              returnsUnits: body.returnsUnits,
              sourceCode: body.codeFile
            };
            callback(err, result, response.statusCode);
          } else {
            request.get({ uri: path_r, json: true }, function (err, response, body) {
              if (response.statusCode === 200) {
                let result = {
                  name: body.name,
                  description: body.desc,
                  connections: body.connects.map(function (obj) {
                    var temp = {
                      start: obj.start.name,
                      end: obj.end.name,
                      mathRelation: obj.mathRelation
                    };
                    return temp;
                  })
                };
                callback(err, result, response.statusCode);
              } else {
                let result = new Object('Couldn\'t find that in DB.'); // keep convention that always an object is returned.
                callback(err, result, response.statusCode);
              }
            });
          }
        });
      }
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
  let tokenizer = new natural.WordTokenizer();
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

  var path = this._fullAddress('/cbm/call/');
  var caller = this;
  request.post({uri: path, headers: {returncode: returnCode}, form: params, json: true}, function (err, response, body) {
    if (returnCode) {
      caller.getCode(body.function, callback);
    } else {
      callback(err, pipe.parse(body), response.statusCode);
    }
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
};

module.exports = CallByMeaning;