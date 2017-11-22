/* eslint no-invalid-this: "off" */

'use strict';

const request = require('request-promise');

async function search(...args) {
  let nargs = args.length;
  let params;

  if (nargs < 1) {
    throw new Error('Insufficient input arguments. Must provide a params object.');
  }

  if (nargs < 3) {
    params = args[0];
    if (params.outputNodes == null) {
      params = {};
      args.reverse();
      params =
        {
          inputNodes: args[1] || [],
          outputNodes: args[0] || [],
        };
    }
  } else {
    throw new Error('Too many input arguments. Must provide one params object or two arrays/strings(input, output) or one array/string(output).');
  }

  let response = await request.post({uri: this.fullAddress_('/gbm/search/'), form: params, json: true, resolveWithFullResponse: true, simple: false});
  let result = response.body.map((obj) => {
    let temp = {
      function: obj.function.split('/').pop(),
      description: obj.desc,
    };
    return temp;
  });
  response.body = result;
  return response;
}

module.exports = search;