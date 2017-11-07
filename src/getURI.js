'use strict';

var natural = require('natural');

function getURI() {
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
}

module.exports = getURI;