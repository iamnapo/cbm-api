/* eslint-env node, mocha */

'use strict';

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var CallByMeaning = require('../index.js');


describe('CallByMeaning', function tests() {
  describe('Initial config', function test() {
    it('creates an instance of CallByMeaning', function test(done) {
      var cbm = new CallByMeaning();
      assert(cbm instanceof CallByMeaning);
      done();
    });

    it('can be invoked without new', function test(done) {
      var cbm = CallByMeaning();
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
      this.timeout(2000);
      var cbm = new CallByMeaning();
      expect(badValue()).to.throw(Error);

      function badValue() {
        return function () {
          cbm.lookup('time');
        };
      }
      done();
    });

    it('throws an error if URI argument is not a string primitive', function test(done) {
      this.timeout(2000);
      var cbm = new CallByMeaning();
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
      this.timeout(2000);
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
      this.timeout(2000);
      var cbm = new CallByMeaning();
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
      this.timeout(2000);
      var cbm = new CallByMeaning();
      cbm.lookup('time', 'c', function (err, result) {
        assert(result.statusCode === 200);
        done();
      });
    });

    it('looks up a single function without specified \'f\' type', function test(done) {
      this.timeout(2000);
      var cbm = new CallByMeaning();
      cbm.lookup('getTime', function (err, result) {
        assert(result.statusCode === 200);
        done();
      });
    });

    it('looks up a single relation without specified \'r\' type', function test(done) {
      this.timeout(2000);
      var cbm = new CallByMeaning();
      cbm.lookup('unitConversion', function (err, result) {
        assert(result.statusCode === 200);
        done();
      });
    });

    it('returns correctly if it can\'t find the object in the server' , function test(done) {
      this.timeout(2000);
      var cbm = new CallByMeaning();
      cbm.lookup('blabla', function (err, result) {
        assert(result.statusCode === 418);
        done();
      });
    });

  });

  describe('.getURI()', function tests() {

    it('throws an error if supplied with more than one argument', function test(done) {
      this.timeout(2000);
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
      this.timeout(2000);
      var cbm = new CallByMeaning();
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
      this.timeout(2000);
      var cbm = new CallByMeaning();
      let result = cbm.getURI('a big    ,  !!  dog!');
      assert(result === 'big_dog');
      done();
    });

  });

  describe('.search()', function tests() {

    it('throws an error if supplied with less than required arguments', function test(done) {
      this.timeout(2000);
      var cbm = new CallByMeaning();
      expect(badValue()).to.throw(Error);

      function badValue() {
        return function () {
          cbm.search('big dog');
        };
      }
      done();
    });

    it('throws an error if params argument is not an object', function test(done) {
      this.timeout(2000);
      var cbm = new CallByMeaning();
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
      this.timeout(2000);
      var cbm = new CallByMeaning();
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
            outputUnits: 'seconds'
          }, value);
        };
      }
      done();
    });

    it('is possible to use search method to find CallByMeaning functions', function test(done) {
      this.timeout(2000);
      var cbm = new CallByMeaning();
      cbm.search({
        outputNodes: 'time',
        outputUnits: 'seconds'
      }, function (err, result, body) {
        assert(body.desc === 'This function returns the current time in seconds since 01/01/1970');
        done();
      });
    });

  });

  describe('.call()', function tests() {

    it('throws an error if not supplied with at least two arguments', function test(done) {
      this.timeout(2000);
      var cbm = new CallByMeaning();
      expect(badValue()).to.throw(Error);

      function badValue() {
        return function () {
          cbm.call({
            outputNodes: 'time',
            outputUnits: 'seconds'
          });
        };
      }
      done();
    });

    it('throws an error if params argument is not an object', function test(done) {
      this.timeout(2000);
      var cbm = new CallByMeaning();
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
      this.timeout(2000);
      var cbm = new CallByMeaning();
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
            outputUnits: 'seconds'
          }, value);
        };
      }
      done();
    });

    it('is possible to retrieve results', function test(done) {
      this.timeout(3000);
      var cbm = new CallByMeaning();
      cbm.call({
        outputNodes: 'time',
        outputUnits: 'seconds'
      }, function (err, response) {
        assert(response.statusCode === 200);
        done();
      });
    });

    it('is possible to retrieve code', function test(done) {
      this.timeout(3000);
      var cbm = new CallByMeaning();
      cbm.call({
        outputNodes: 'time',
        outputUnits: 'seconds'
      }, true, function (err, response) {
        assert(response.statusCode === 200);
        done();
      });
    });

    it('is possible to retrieve results with different units', function test(done) {
      this.timeout(3000);
      var cbm = new CallByMeaning();
      cbm.call({
        outputNodes: 'time',
        outputUnits: 'hours'
      }, function (err, response) {
        assert(response.statusCode === 200);
        done();
      });
    });

  });

  describe('.getCode()', function tests() {

    it('throws an error if supplied with less than two arguments', function test(done) {
      this.timeout(2000);
      var cbm = new CallByMeaning();
      expect(badValue()).to.throw(Error);

      function badValue() {
        return function () {
          cbm.getCode('./js/getTime.js');
        };
      }
      done();
    });

    it('throws an error if argument is not a string primitive', function test(done) {
      this.timeout(2000);
      var cbm = new CallByMeaning();
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
      this.timeout(2000);
      var cbm = new CallByMeaning();
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
          cbm.getCode('./js/getTime.js', value);
        };
      }
      done();
    });

    it('is possible to retrieve code', function test(done) {
      this.timeout(2000);
      var cbm = new CallByMeaning();
      cbm.getCode('./js/getTime.js', function(err, result) {
        assert(result.includes('module.exports'));
        done();
      });
    });

  });

});