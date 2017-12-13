const request = require('sync-request');
const rp = require('request-promise');
const fs = require('fs');

function createNode(params, host) {
  const path = host.concat('/new/node');
  if (params.name == null) return false;
  const res = request('post', path, {
    json: {
      name: params.name,
      desc: params.desc,
      units: params.units,
    },
  });
  return res.statusCode === 200;
}

function createFunction(params, host) {
  const path = host.concat('/new/function');
  if (params.name == null) return false;
  const res = request('post', path, {
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

async function createAsyncFunction(params, callPath, host) {
  const path = host.concat('/new/function');
  if (params.name == null) return false;
  const fullParams = {
    name: '',
    desc: '',
    argsNames: [],
    argsUnits: [],
    returnsNames: [],
    returnsUnits: [],
    codeFile: '',
  };
  Object.assign(fullParams, params);
  try {
    const res = await rp.post({
      uri: path,
      formData: {
        name: fullParams.name,
        desc: fullParams.desc,
        argsNames: fullParams.argsNames,
        argsUnits: fullParams.argsUnits,
        returnsNames: fullParams.returnsNames,
        returnsUnits: fullParams.returnsUnits,
        codeFile: fs.createReadStream(fullParams.codeFile),
      },
      resolveWithFullResponse: true,
    });
    request('post', callPath, { json: { command: 'fixit' } });
    return res.statusCode === 200;
  } catch (error) {
    return false;
  }
}

function createRelation(params, host) {
  const path = host.concat('/new/relation');
  if (params.name == null) return false;
  const res = request('post', path, {
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

async function create(...args) {
  const nargs = args.length;
  let type;

  if (nargs < 1) {
    throw new Error('Insufficient input arguments. Must provide a params object.');
  }
  const params = args[0];
  if (typeof params !== 'object' || params == null) {
    throw new TypeError('Invalid input argument. Argument must be an object.');
  }

  if (nargs < 2) {
    type = 'node';
  } else {
    type = args[1];
    if ((!(typeof type === 'string') || (['node', 'function', 'relation'].indexOf(type) === -1))) {
      throw new TypeError(`Invalid input argument. type argument must be one of 'node', 'function', 'relation'. Value: \`${type}\`.`);
    }
  }

  const path = this.host.concat('/new/fix');
  if (!(params.codeFile == null || params.codeFile.length === 0)) {
    return createAsyncFunction(params, path, this.host);
  }
  let created = false;
  if (type === 'node') created = createNode(params, this.host);
  if (type === 'function') created = createFunction(params, this.host);
  if (type === 'relation') created = createRelation(params, this.host);
  await rp.post(path, { json: { command: 'fixit' } });
  return created;
}

module.exports = create;
