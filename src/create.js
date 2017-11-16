/* eslint no-invalid-this: "off" */

'use strict';

const request = require('sync-request');
const rp = require('request-promise');
const fs = require('fs');

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
    },
  });
  return res.statusCode === 200;
}

async function createAsyncFunction(params, host) {
  let path = host.concat('/new/function');
  if (params.name == null) return false;
  let fullParams = {
    name: '',
    desc: '',
    argsNames: [],
    argsUnits: [],
    returnsNames: [],
    returnsUnits: [],
    codeFile: '',
  };
  Object.assign(fullParams, params);
  let res = await rp.post({uri: path, formData: {
    name: fullParams.name,
    desc: fullParams.desc,
    argsNames: fullParams.argsNames,
    argsUnits: fullParams.argsUnits,
    returnsNames: fullParams.returnsNames,
    returnsUnits: fullParams.returnsUnits,
    codeFile: fs.createReadStream(fullParams.codeFile),
  }, resolveWithFullResponse: true});
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
    if (params.codeFile) {
      created = createAsyncFunction(params, this.host);
    } else {
      created = createFunction(params, this.host);
    }
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