# cbm-api    [![Build Status](https://travis-ci.com/iamnapo/cbm-api.svg?token=dPuvXqxKaaMT7sVBkN1H&branch=master)](https://travis-ci.com/iamnapo/cbm-api) [![codecov](https://codecov.io/gh/iamnapo/cbm-api/branch/master/graph/badge.svg?token=CSMrm2a8S1)](https://codecov.io/gh/iamnapo/cbm-api)

Node.js interface to the CallByMeaning network server. For further information, consult the website of the server-side project: [CallByMeaning](https://github.com/iamnapo/CallByMeaning).

## Introduction

The cbm-api package can be easily installed via npm:

``` bash
npm install iamnapo/cbm-api
```

To require the module in a project, we can use the expression:

```javascript
var CallByMeaning = require('cbm-api');
```

## Getting Started

The module exports a single constructor which can be used to open an API connection. Simply call it and store the expression result in a variable:

``` javascript
var cbm = CallByMeaning();
```

In case that you are running your own copy of the CallByMeaning server, the constructor takes the hostname of the server as an optional argument. The default option evaluates to "[https://call-by-meaning.herokuapp.com](https://call-by-meaning.herokuapp.com/)".

```javascript
CallByMeaning(host);
```

Example:

```javascript
var cbm = CallByMeaning('192.168.1.1');
```

We can then use the following five methods to query the CallByMeaning API:

## Methods

### `.lookup(uri[, type], callback)`

This method expects a valid CallByMeaning URI as its first argument.
`type` is an (optional) string that specifies the type of the GET request. It can have the keys `c`, `f` or `r`. The `callback` function has three parameters: The `err` parameter will return error objects in case that something goes
wrong during the function invocation. If the query is successful, `err` is `undefined` and the `response` parameter holds server's response. The `body` parameter holds the result set from the query.

Example code:

```javascript
cbm.lookup('time', 'c', function (err, response, body) {
  // insert code here
});
```

### `.getURI(text)`

This method finds out what the CallByMeaning URI is for a given text, applying steps such as reducing English words to their root form and removing special characters.

Example code:

```javascript
cbm.getURI('a (big) dog!'); //-> big_dog
```

### `.search(params, callback)`

The search method takes a parameter object and hands the retrieved results to the callback function. For a full overview of search parameters, check the [documentation](https://github.com/iamnapo/CallByMeaning/blob/master/docs/GETBYMEANING.md).

Example code:

```javascript
cbm.search({
  'inputNodes': 'date',
  'outputNodes': 'time'
}, function (err, response, body) {
  // insert code here
});
```

### `.call(params[, returncode], callback)`

The call method takes a parameter object and after finding an appropriate function - a function with the same concepts as inputs and outputs, but (maybe) in different units, that is - executes it and passes the result to the callback function. If the (optional) argument `returncode` is set to true, it instead passes the .js file's location and the description of the function. For a full overview of search parameters, check the [documentation](https://github.com/iamnapo/CallByMeaning/blob/master/docs/CALLBYMEANING.md).

Example code:

```javascript
var bday = new Date(1994, 3, 24);
cbm.call({
  'inputNodes': 'date',
  'inputUnits': 'date',
  'inputVars': bday,
  'outputNodes': 'time',
  'outputUnits': 'seconds'
}, function (err, response, body) {
  // insert code here
});
```

### `.getCode(path, callback)`

This method acts as a small helper to the usage of `.search` and `.call` methods. It takes the `path` of a .js file in the server and passes its code in plain text into the callback.

Example code:

```javascript
cbm.getCode('/js/getTime.js', function (err, result) {
  // insert code here
});
```

## Unit Tests

Run tests via the command `npm test`

---

## License

[AGPL-3.0 license](https://opensource.org/licenses/AGPL-3.0).
