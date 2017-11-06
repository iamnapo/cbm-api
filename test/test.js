/* eslint-env node, mocha */

'use strict';

var chai = require('chai');
require('dotenv').load();
var assert = chai.assert;
var expect = chai.expect;
var CallByMeaning = require('../index.js');

const TIMEOUT_TIME = 3000;
const HOST = process.env.HOST || 'https://call-by-meaning.herokuapp.com';

describe('CallByMeaning', function tests() {
  describe('Initial config', function test() {
    it('creates an instance of CallByMeaning', function test(done) {
      var cbm = new CallByMeaning(HOST);
      assert(cbm instanceof CallByMeaning);
      done();
    });

    it('can be invoked without new', function test(done) {
      var cbm = CallByMeaning(HOST);
      assert(cbm instanceof CallByMeaning);
      done();
    });

    describe('defaults', function tests() {
      it('has default hostname', function test(done) {
        var cbm = new CallByMeaning();
        assert(cbm.host === 'https://call-by-meaning.herokuapp.com');
        done();
      });

    });

    describe('override', function () {
      it('has set hostname', function test(done) {
        var cbm = new CallByMeaning('10.0.0.1');
        assert(cbm.host === '10.0.0.1');
        done();
      });

    });

  });

  describe('.lookup()', function tests() {

    it('throws an error if not supplied at least two arguments', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning(HOST);
      expect(badValue()).to.throw(Error);

      function badValue() {
        return function () {
          cbm.lookup('time');
        };
      }
      done();
    });

    it('throws an error if URI argument is not a string primitive', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning(HOST);
      var values = [
        function () {},
        5,
        true,
        undefined,
        null,
        NaN, [],
        {}
      ];

      for (var i = 0; i < values.length; i++) {
        expect(badValue(values[i])).to.throw(TypeError);
      }

      function badValue(value) {
        return function () {
          cbm.lookup(value, function () {});
        };
      }
      done();
    });

    it('throws an error if type argument is not one of c, f, r', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning();
      var values = [
        function () {},
        '5',
        5,
        true,
        undefined,
        null,
        NaN, []
      ];

      for (var i = 0; i < values.length; i++) {
        expect(badValue(values[i])).to.throw(TypeError);
      }

      function badValue(value) {
        return function () {
          cbm.lookup('time', value, function () {});
        };
      }
      done();
    });

    it('throws an error if callback argument is not a function', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning(HOST);
      var values = [
        '5',
        5,
        true,
        undefined,
        null,
        NaN, [],
        {}
      ];

      for (var i = 0; i < values.length; i++) {
        expect(badValue(values[i])).to.throw(TypeError);
      }

      function badValue(value) {
        return function () {
          cbm.lookup('time', value);
        };
      }
      done();
    });


    it('looks up a single concept', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning(HOST);
      cbm.lookup('time', 'c', function (err, result, status) {
        assert(status === 200);
        done();
      });
    });

    it('looks up a single function without specified \'f\' type', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning(HOST);
      cbm.lookup('now', function (err, result, status) {
        assert(status === 200);
        done();
      });
    });

    it('looks up a single relation without specified \'r\' type', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning(HOST);
      cbm.lookup('unitConversion', function (err, result, status) {
        assert(status === 200);
        done();
      });
    });

    it('returns correctly if it can\'t find the object in the server' , function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning();
      cbm.lookup('blabla', function (err, result, status) {
        assert(status === 418 && (typeof result) === 'object');
        done();
      });
    });

  });

  describe('.getURI()', function tests() {

    it('throws an error if supplied with more than one argument', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning();
      expect(badValue()).to.throw(Error);

      function badValue() {
        return function () {
          cbm.getURI('big dog', 5);
        };
      }
      done();
    });

    it('throws an error if argument is not a string primitive', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning(HOST);
      var values = [
        function () {},
        5,
        true,
        undefined,
        null,
        NaN, [],
        {}
      ];

      for (var i = 0; i < values.length; i++) {
        expect(badValue(values[i])).to.throw(TypeError);
      }

      function badValue(value) {
        return function () {
          cbm.getURI(value);
        };
      }
      done();
    });

    it('looks up the CallByMeaning URI for text', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning(HOST);
      let result = cbm.getURI('a big    ,  !!  dog!');
      assert(result === 'big_dog');
      done();
    });

  });

  describe('.search()', function tests() {

    it('throws an error if supplied with less than required arguments', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning(HOST);
      expect(badValue()).to.throw(Error);

      function badValue() {
        return function () {
          cbm.search('big dog');
        };
      }
      done();
    });

    it('throws an error if params argument is not an object', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning(HOST);
      var values = [
        '5',
        5,
        true,
        undefined,
        null,
        NaN,
        function () {}
      ];

      for (var i = 0; i < values.length; i++) {
        expect(badValue(values[i])).to.throw(TypeError);
      }

      function badValue(value) {
        return function () {
          cbm.search(value, function () {});
        };
      }
      done();
    });

    it('throws an error if callback argument is not a function', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning(HOST);
      var values = [
        '5',
        5,
        true,
        undefined,
        null,
        NaN, [],
        {}
      ];

      for (var i = 0; i < values.length; i++) {
        expect(badValue(values[i])).to.throw(TypeError);
      }

      function badValue(value) {
        return function () {
          cbm.search({
            outputNodes: 'time',
            outputUnits: 'milliseconds'
          }, value);
        };
      }
      done();
    });

    it('is possible to use search method to find CallByMeaning functions', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning(HOST);
      cbm.search({
        outputNodes: 'time',
      }, function (err, result, status) {
        assert(result[0].description === 'Gets the timestamp of the number of milliseconds that have elapsed since the Unix epoch (1 January 1970 00:00:00 UTC).' && status === 200);
        done();
      });
    });

  });

  describe('.call()', function tests() {

    it('throws an error if not supplied with at least two arguments', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning(HOST);
      expect(badValue()).to.throw(Error);

      function badValue() {
        return function () {
          cbm.call({
            outputNodes: 'time',
            outputUnits: 'milliseconds'
          });
        };
      }
      done();
    });

    it('throws an error if params argument is not an object', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning(HOST);
      var values = [
        function () {},
        '5',
        5,
        true,
        undefined,
        null,
        NaN
      ];

      for (var i = 0; i < values.length; i++) {
        expect(badValue(values[i])).to.throw(TypeError);
      }

      function badValue(value) {
        return function () {
          cbm.call(value, function () {});
        };
      }
      done();
    });

    it('throws an error if callback argument is not a function', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning(HOST);
      var values = [
        '5',
        5,
        true,
        undefined,
        null,
        NaN, [],
        {}
      ];

      for (var i = 0; i < values.length; i++) {
        expect(badValue(values[i])).to.throw(TypeError);
      }

      function badValue(value) {
        return function () {
          cbm.call({
            outputNodes: 'time',
            outputUnits: 'milliseconds'
          }, value);
        };
      }
      done();
    });

    it('is possible to retrieve results', function test(done) {
      this.timeout(3000);
      var cbm = new CallByMeaning(HOST);
      cbm.call({
        outputNodes: 'time',
        outputUnits: 'milliseconds'
      }, function (err, result, status) {
        assert(status === 200);
        done();
      });
    });

    it('is possible to retrieve code', function test(done) {
      this.timeout(3000);
      var cbm = new CallByMeaning(HOST);
      cbm.call({
        outputNodes: 'time',
        outputUnits: 'milliseconds'
      }, true, function (err, result, status) {
        assert(status === 200);
        done();
      });
    });

    it('is possible to retrieve results with different units', function test(done) {
      this.timeout(3000);
      var cbm = new CallByMeaning(HOST);
      cbm.call({
        outputNodes: 'time',
        outputUnits: 'hours'
      }, function (err, result, status) {
        cbm.call({
          outputNodes: 'time',
          outputUnits: 'milliseconds'
        }, function (err, result2, status2) {
          assert((status === status2 && status === 200) && result2 - 3600000 * result < 1000);
          done();
        });
      });
    });

  });

  describe('.getCode()', function tests() {

    it('throws an error if supplied with less than two arguments', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning(HOST);
      expect(badValue()).to.throw(Error);

      function badValue() {
        return function () {
          cbm.getCode('./js/now.js');
        };
      }
      done();
    });

    it('throws an error if argument is not a string primitive', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning(HOST);
      var values = [
        function () {},
        5,
        true,
        undefined,
        null,
        NaN, [],
        {}
      ];

      for (var i = 0; i < values.length; i++) {
        expect(badValue(values[i])).to.throw(TypeError);
      }

      function badValue(value) {
        return function () {
          cbm.getCode(value, function () {});
        };
      }
      done();
    });

    it('throws an error if callback argument is not a function', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning(HOST);
      var values = [
        '5',
        5,
        true,
        undefined,
        null,
        NaN, [],
        {}
      ];

      for (var i = 0; i < values.length; i++) {
        expect(badValue(values[i])).to.throw(TypeError);
      }

      function badValue(value) {
        return function () {
          cbm.getCode('./js/now.js', value);
        };
      }
      done();
    });

    it('is possible to retrieve code', function test(done) {
      this.timeout(TIMEOUT_TIME);
      var cbm = new CallByMeaning(HOST);
      cbm.getCode('./js/now.js', function(err, result) {
        assert(result.includes('module.exports'));
        done();
      });
    });

  });

});