/* eslint no-invalid-this: "off" */

'use strict';

const request = require('sync-request');

function createNode(params, host) {
  let path = host.concat('/new/node');
  if (params.name == null) return false;
  let res = request('post', path, {
    json: {
      name: params.name,
      desc: params.desc,
      units: params.units,
    },
  });
  return res.statusCode === 200;
}

function createFunction(params, host) {
  let path = host.concat('/new/function');
  if (params.name == null) return false;
  let res = request('post', path, {
    json: {
      name: params.name,
      desc: params.desc,
      argsNames: params.argsNames,
      argsUnits: params.argsUnits,
      returnsNames: params.returnsNames,
      returnsUnits: params.returnsUnits,
      codeFile: params.codeFile,
    },
  });
  return res.statusCode === 200;
}

function createRelation(params, host) {
  let path = host.concat('/new/relation');
  if (params.name == null) return false;
  let res = request('post', path, {
    json: {
      name: params.name,
      desc: params.desc,
      start: params.start,
      end: params.end,
      mathRelation: params.mathRelation,
    },
  });
  return res.statusCode === 200;
}

function create(...args) {
  let nargs = args.length;
  let params;
  let type;

  if (nargs < 1) {
    throw new Error('Insufficient input arguments. Must provide a params object.');
  }
  params = args[0];
  if (typeof params !== 'object' || params == null) {
    throw new TypeError('Invalid input argument. Argument must be an object.');
  }

  if (nargs < 2) {
    type = 'node';
  } else {
    type = args[1];
    if ((!(typeof type === 'string') || (['node', 'function', 'relation'].indexOf(type) === -1))) {
      throw new TypeError('Invalid input argument. type argument must be one of \'node\', \'function\', \'relation\'. Value: `' + type + '`.');
    }
  }

  let created = false;
  switch (type) {
  case 'node':
    created = createNode(params, this.host);
    break;
  case 'function':
    created = createFunction(params, this.host);
    break;
  case 'relation':
    created = createRelation(params, this.host);
    break;
  }
  let path = this.host.concat('/new/fix');
  request('post', path, {json: {command: 'fixit'}});
  return created;
}

module.exports = create;