'use strict';

var request = require('request');

function lookup () {
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
    request.get({ uri: this._fullAddress(path), json: true }, function (err, response, body) {
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
    request.get({ uri: path_c, json: true }, function (err, response, body) {
      if (response.statusCode === 200) {
        let result = {
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
}

module.exports = lookup;