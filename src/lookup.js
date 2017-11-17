/* eslint no-invalid-this: "off" */

'use strict';

const request = require('request-promise');

async function lookup(...args) {
  let nargs = args.length;
  let uri;
  let type;

  if (nargs < 1) {
    throw new Error('Insufficient input arguments. Must provide a CallByMeaning URI.');
  }

  uri = args[0];
  if (!(typeof uri === 'string')) {
    throw new TypeError('Invalid input argument. First argument must be a string primitive. Value: `' + uri + '`.');
  }

  if (nargs < 2) {
    type = 'all';
  } else {
    type = args[1];
    if ((!(typeof uri === 'string') || (['c', 'f', 'r'].indexOf(type) === -1))) {
      throw new TypeError('Invalid input argument. type argument must be one of \'c\', \'f\', \'r\'. Value: `' + type + '`.');
    }
  }

  if (type !== 'all') {
    let path = '/gbn/' + type + '/' + String(encodeURIComponent(uri));
    let response = await request.get({uri: this.fullAddress_(path), json: true, resolveWithFullResponse: true, simple: false});
    if (response.statusCode === 200) {
      let result;
      switch (type) {
      case 'c':
        result = {
          name: response.body.name,
          description: response.body.desc,
          units: response.body.units,
          asInput: response.body.func_arg.map((obj) => {
            let temp = {
              name: obj.name,
              unit: obj.unitType,
            };
            return temp;
          }),
          asOutput: response.body.func_res.map((obj) => {
            let temp = {
              name: obj.name,
              unit: obj.unitType,
            };
            return temp;
          }),
        };
        break;
      case 'f':
        result = {
          name: response.body.name,
          description: response.body.desc,
          units: response.body.units,
          argsNames: response.body.argsNames,
          argsUnits: response.body.argsUnits,
          returnsNames: response.body.returnsNames,
          returnsUnits: response.body.returnsUnits,
          sourceCode: response.body.codeFile,
        };
        break;
      case 'r':
        result = {
          name: response.body.name,
          description: response.body.desc,
          connections: response.body.connects.map((obj) => {
            let temp = {
              start: obj.start.name,
              end: obj.end.name,
              mathRelation: obj.mathRelation,
            };
            return temp;
          }),
        };
        break;
      }
      response.body = result;
      return response;
    } else {
      let result = Object('Couldn\'t find that in DB.'); // keep convention that always an object is returned.
      response.body = result;
      return response;
    }
  } else {
    let pathC = this.fullAddress_('/gbn/' + 'c' + '/' + String(encodeURIComponent(uri)));
    let pathF = this.fullAddress_('/gbn/' + 'f' + '/' + String(encodeURIComponent(uri)));
    let pathR = this.fullAddress_('/gbn/' + 'r' + '/' + String(encodeURIComponent(uri)));
    let response = await request.get({uri: pathC, json: true, resolveWithFullResponse: true, simple: false});
    if (response.statusCode === 200) {
      let result = {
        name: response.body.name,
        description: response.body.desc,
        units: response.body.units,
        asInput: response.body.func_arg.map((obj) => {
          let temp = {
            name: obj.name,
            unit: obj.unitType,
          };
          return temp;
        }),
        asOutput: response.body.func_res.map((obj) => {
          let temp = {
            name: obj.name,
            unit: obj.unitType,
          };
          return temp;
        }),
      };
      response.body = result;
      return response;
    } else {
      let response = await request.get({uri: pathF, json: true, resolveWithFullResponse: true, simple: false});
      if (response.statusCode === 200) {
        let result = {
          name: response.body.name,
          description: response.body.desc,
          units: response.body.units,
          argsNames: response.body.argsNames,
          argsUnits: response.body.argsUnits,
          returnsNames: response.body.returnsNames,
          returnsUnits: response.body.returnsUnits,
          sourceCode: response.body.codeFile,
        };
        response.body = result;
        return response;
      } else {
        let response = await request.get({uri: pathR, json: true, resolveWithFullResponse: true, simple: false});
        if (response.statusCode === 200) {
          let result = {
            name: response.body.name,
            description: response.body.desc,
            connections: response.body.connects.map((obj) => {
              let temp = {
                start: obj.start.name,
                end: obj.end.name,
                mathRelation: obj.mathRelation,
              };
              return temp;
            }),
          };
          response.body = result;
          return response;
        } else {
          let result = Object('Couldn\'t find that in DB.'); // keep convention that always an object is returned.
          response.body = result;
          return response;
        }
      }
    }
  }
}

module.exports = lookup;