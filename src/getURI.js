'use strict';

const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

function getURI(...args) {
  let nargs = args.length;
  let text;

  if (nargs !== 1) {
    throw new Error('Invalid input arguments. Must provide only an input text.');
  }
  text = args[0];
  if (!(typeof text === 'string')) {
    throw new TypeError('Invalid input argument. Argument must be a string primitive. Value: `' + text + '`.');
  }
  text = text.replace(/[^\w\d\s]/g, '');
  let stemmed = tokenizer.tokenize(text);
  stemmed = stemmed.filter((item) => {
    return (item !== 'a') && (item !== 'the') && (item !== 'an');
  });
  return stemmed.join('_');
}

module.exports = getURI;