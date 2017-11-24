/* eslint-env node, mocha */
/* eslint no-invalid-this: "off" */

'use strict';

require('dotenv').load();
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const request = require('sync-request');
const CallByMeaning = require('../index.js');

const TIMEOUT_TIME_1 = 2000;
const HOST = process.env.HOST || 'https://call-by-meaning.herokuapp.com';

function sleep(milliseconds) {
  let start = new Date().getTime();
  for (let i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}
const SLEEP_TIME = 2000;
const TIMEOUT_TIME_2 = TIMEOUT_TIME_1 + SLEEP_TIME;

describe('CallByMeaning', function tests() {
  describe('Initial config', function test() {
    it('creates an instance of CallByMeaning', function test(done) {
      const cbm = new CallByMeaning(HOST);
      assert(cbm instanceof CallByMeaning);
      done();
    });

    it('can\'t be invoked without new', function test(done) {
      // eslint-disable-next-line new-cap
      expect((HOST) => CallByMeaning(HOST)).to.throw(TypeError);
      done();
    });

    describe('defaults', function tests() {
      it('has default hostname', function test(done) {
        const cbm = new CallByMeaning();
        assert(cbm.host === 'https://call-by-meaning.herokuapp.com');
        done();
      });
    });

    describe('override', function() {
      it('has set hostname', function test(done) {
        const cbm = new CallByMeaning('10.0.0.1');
        assert(cbm.host === '10.0.0.1');
        done();
      });
    });
  });

  describe('.lookup()', function tests() {
    it('throws an error if not supplied at least one argument', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      const cbm = new CallByMeaning(HOST);
      cbm.lookup().then(() => {
        done(new Error('Expected method to reject.'));
      }).catch((err) => {
        assert.isDefined(err);
        done();
      }).catch(done);
    });

    it('throws an error if URI argument is not a string primitive', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      const cbm = new CallByMeaning(HOST);
      let values = [
        function() {},
        5,
        true,
        undefined,
        null,
        NaN, [],
        {},
      ];

      for (let i = 0; i < values.length; i++) {
        cbm.lookup(values[i]).catch((err) => {
          assert.isDefined(err);
        });
      }
      done();
    });

    it('throws an error if type argument is not one of c, f, r', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      const cbm = new CallByMeaning(HOST);
      let values = [
        function() {},
        '5',
        5,
        true,
        undefined,
        null,
        NaN, [],
      ];

      for (let i = 0; i < values.length; i++) {
        cbm.lookup('time', values[i]).catch((err) => {
          assert.isDefined(err);
        });
      }
      done();
    });

    it('looks up a single concept', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning(HOST);
      cbm.lookup('function', 'c').then((response) => {
        assert(response.statusCode === 200);
        done();
      });
    });

    it('looks up a single function', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning(HOST);
      cbm.lookup('add', 'f').then((response) => {
        assert(response.statusCode === 200);
        done();
      });
    });

    it('looks up a single relation', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning(HOST);
      cbm.lookup('unitConversion', 'r').then((response) => {
        assert(response.statusCode === 200);
        done();
      });
    });

    it('looks up a single concept without specified \'c\' type', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning(HOST);
      cbm.lookup('function').then((response) => {
        assert(response.statusCode === 200);
        done();
      });
    });

    it('looks up a single function without specified \'f\' type', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning(HOST);
      cbm.lookup('now').then((response) => {
        assert(response.statusCode === 200);
        done();
      });
    });

    it('looks up a single relation without specified \'r\' type', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning(HOST);
      cbm.lookup('unitConversion').then((response) => {
        assert(response.statusCode === 200);
        done();
      });
    });

    it('returns correctly if it can\'t find the object in the server (with specified type)', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning();
      cbm.lookup('blabla', 'c').then((response) => {
        assert(response.statusCode === 418 && (typeof response.body === 'object'));
        done();
      });
    });

    it('returns correctly if it can\'t find the object in the server (without specified type)', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning();
      cbm.lookup('blabla').then((response) => {
        assert(response.statusCode === 418 && (typeof response.body === 'object'));
        done();
      });
    });
  });

  describe('.getURI()', function tests() {
    it('throws an error if supplied with more than one argument', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning();
      expect(badValue()).to.throw(Error);

      function badValue() {
        return function() {
          cbm.getURI('big dog', 5);
        };
      }
      done();
    });

    it('throws an error if argument is not a string primitive', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning(HOST);
      let values = [
        function() {},
        5,
        true,
        undefined,
        null,
        NaN, [],
        {},
      ];

      for (let i = 0; i < values.length; i++) {
        expect(badValue(values[i])).to.throw(TypeError);
      }

      function badValue(value) {
        return function() {
          cbm.getURI(value);
        };
      }
      done();
    });

    it('looks up the CallByMeaning URI for text', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning(HOST);
      let result = cbm.getURI('a big    ,  !!  dog!');
      assert(result === 'big_dog');
      done();
    });
  });

  describe('.search()', function tests() {
    it('throws an error if not supplied at least one argument', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      const cbm = new CallByMeaning(HOST);
      cbm.search().then(() => {
        done(new Error('Expected method to reject.'));
      }).catch((err) => {
        assert.isDefined(err);
        done();
      }).catch(done);
    });

    it('throws an error if supplied with too many arguments', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning(HOST);
      cbm.search({}, 'a', ['b']).catch((err) => {
        assert.isDefined(err);
        done();
      });
    });

    it('is possible to use search method to find CallByMeaning functions by params object', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning(HOST);
      cbm.search({outputNodes: 'time'}).then((result) => {
        assert(result.body[0].description === 'Gets the timestamp of the number of milliseconds that have elapsed since the Unix epoch (1 January 1970 00:00:00 UTC).' && result.statusCode === 200);
        done();
      });
    });

    it('is possible to use search method to find CallByMeaning functions by providing all properties', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning(HOST);
      cbm.search('time').then((result) => {
        assert(result.body[0].description === 'Gets the timestamp of the number of milliseconds that have elapsed since the Unix epoch (1 January 1970 00:00:00 UTC).' && result.statusCode === 200);
        done();
      });
    });
  });

  describe('.call()', function tests() {
    it('throws an error if not supplied at least one argument', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      const cbm = new CallByMeaning(HOST);
      cbm.call().then(() => {
        done(new Error('Expected method to reject.'));
      }).catch((err) => {
        assert.isDefined(err);
        done();
      }).catch(done);
    });

    it('throws an error if supplied with too many arguments', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning(HOST);
      cbm.call(1, 2, 3, 4, 5, 6, 7, 8).catch((err) => {
        assert.isDefined(err);
        done();
      });
    });

    it('is possible to retrieve results (params)', function test(done) {
      this.timeout(3000);
      let cbm = new CallByMeaning(HOST);
      cbm.call({
        outputNodes: 'time',
        outputUnits: 'milliseconds',
      }).then((result) => {
        assert(result.statusCode === 200);
        done();
      });
    });

    it('is possible to retrieve results (many args)', function test(done) {
      this.timeout(3000);
      let cbm = new CallByMeaning(HOST);
      cbm.call('time', 'milliseconds').then((result) => {
        assert(result.statusCode === 200);
        done();
      });
    });

    it('is possible to retrieve results (many args) when returnCode === false', function test(done) {
      this.timeout(3000);
      let cbm = new CallByMeaning(HOST);
      cbm.call('date', null, [new Date()], 'time', 'milliseconds', false).then((result) => {
        assert(result.statusCode === 200);
        done();
      });
    });

    it('is possible to retrieve code (params)', function test(done) {
      this.timeout(3000);
      let cbm = new CallByMeaning(HOST);
      cbm.call({
        outputNodes: 'time',
        outputUnits: 'milliseconds',
      }, true).then((result) => {
        assert(result.statusCode === 200);
        done();
      });
    });

    it('is possible to retrieve code (many args)', function test(done) {
      this.timeout(3000);
      let cbm = new CallByMeaning(HOST);
      cbm.call('date', null, 'time', 'milliseconds', true).then((result) => {
        assert(result.statusCode === 200);
        done();
      });
    });

    it('is possible to retrieve results with different units', function test(done) {
      this.timeout(3000);
      let cbm = new CallByMeaning(HOST);
      cbm.call({
        outputNodes: 'time',
        outputUnits: 'hours',
      }).then((result) => {
        cbm.call('time', 'milliseconds').then((result2) => {
          assert((result.statusCode === result2.statusCode && result.statusCode === 200) && result2.body - 3600000 * result.body < 2000);
          done();
        });
      });
    });
  });

  describe('.getCode()', function tests() {
    it('throws an error if supplied with more than one argument', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning();
      expect(badValue()).to.throw(Error);

      function badValue() {
        return function() {
          cbm.getCode('now.js', 5);
        };
      }
      done();
    });

    it('throws an error if argument is not a string primitive', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning(HOST);
      let values = [
        function() {},
        5,
        true,
        undefined,
        null,
        NaN, [],
        {},
      ];

      for (let i = 0; i < values.length; i++) {
        expect(badValue(values[i])).to.throw(TypeError);
      }

      function badValue(value) {
        return function() {
          cbm.getCode(value);
        };
      }
      done();
    });

    it('is possible to retrieve code if input is a path', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning(HOST);
      let result = cbm.getCode('./js/now.js');
      assert(result.includes('module.exports'));
      done();
    });

    it('is possible to retrieve code if input is filename', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning(HOST);
      let result = cbm.getCode('now.js');
      assert(result.includes('module.exports'));
      done();
    });
  });

  describe('.create()', function tests() {
    it('throws an error if not supplied at least one argument', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      const cbm = new CallByMeaning(HOST);
      expect(badValue()).to.throw(Error);

      function badValue() {
        return function() {
          cbm.create();
        };
      }
      done();
    });

    it('throws an error if params argument is not an object', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      const cbm = new CallByMeaning(HOST);
      let values = [
        function() { },
        5,
        true,
        undefined,
        NaN,
        'test',
      ];

      for (let i = 0; i < values.length; i++) {
        expect(badValue(values[i])).to.throw(TypeError);
      }

      function badValue(value) {
        return function() {
          cbm.create(value);
        };
      }
      done();
    });

    it('throws an error if type argument is not one of node, function, relation', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      const cbm = new CallByMeaning();
      let values = [
        function() { },
        '5',
        5,
        true,
        undefined,
        null,
        NaN, [],
        {},
      ];

      for (let i = 0; i < values.length; i++) {
        expect(badValue(values[i])).to.throw(TypeError);
      }

      function badValue(value) {
        return function() {
          cbm.create({name: 'Napo'}, value);
        };
      }
      done();
    });

    it('creates a single Node', function test(done) {
      this.timeout(TIMEOUT_TIME_1);
      let cbm = new CallByMeaning(HOST);
      let created = cbm.create({name: 'Napo'}, 'node');
      assert(created);
      done();
    });

    it('creates a single Function', function test(done) {
      this.timeout(TIMEOUT_TIME_2);
      let cbm = new CallByMeaning(HOST);
      sleep(SLEEP_TIME);
      let created = cbm.create({name: 'testFunc'}, 'function');
      assert(created);
      done();
    });

    it('creates a single async Function with existing file', function test(done) {
      this.timeout(TIMEOUT_TIME_2);
      let cbm = new CallByMeaning(HOST);
      sleep(SLEEP_TIME);
      cbm.create({name: 'jsonfn', codeFile: __dirname.concat('/../lib/jsonfn.js')}, 'function')
      .then((result) => {
        assert(result);
        done();
      })
      .catch((err) => {
        assert.isDefined(err);
        done();
      });
    });

    it('creates a single async Function with non-existing file', function test(done) {
      this.timeout(TIMEOUT_TIME_2);
      let cbm = new CallByMeaning(HOST);
      sleep(SLEEP_TIME);
      cbm.create({name: 'jsonfn', codeFile: 'default.js'}, 'function')
        .then((result) => {
          assert(result);
          done();
        })
        .catch((err) => {
          assert.isDefined(err);
          done();
        });
    });

    it('creates a single Relation', function test(done) {
      this.timeout(TIMEOUT_TIME_2);
      let cbm = new CallByMeaning(HOST);
      sleep(SLEEP_TIME);
      let created = cbm.create({name: 'testRel'}, 'relation');
      assert(created);
      done();
    });


    it('creates a single Node if no type specified', function test(done) {
      this.timeout(TIMEOUT_TIME_2);
      let cbm = new CallByMeaning(HOST);
      sleep(SLEEP_TIME);
      let created = cbm.create({name: 'Mary'});
      assert(created);
      done();
    });

    it('returns correctly if it can\'t create the node in the server (with specified type)', function test(done) {
      this.timeout(TIMEOUT_TIME_2);
      let cbm = new CallByMeaning(HOST);
      sleep(SLEEP_TIME);
      let created = cbm.create({desc: 'blabla'}, 'node');
      assert(!created);
      done();
    });

    it('returns correctly if it can\'t create the node in the server (without specified type)', function test(done) {
      this.timeout(TIMEOUT_TIME_2);
      let cbm = new CallByMeaning(HOST);
      sleep(SLEEP_TIME);
      let created = cbm.create({desc: 'blabla'});
      assert(!created);
      done();
    });

    it('returns correctly if it can\'t create the function in the server', function test(done) {
      this.timeout(TIMEOUT_TIME_2);
      let cbm = new CallByMeaning(HOST);
      sleep(SLEEP_TIME);
      let created = cbm.create({desc: 'blabla'}, 'function');
      assert(!created);
      done();
    });

    it('returns correctly if it can\'t create the relation in the server', function test(done) {
      this.timeout(TIMEOUT_TIME_2);
      let cbm = new CallByMeaning(HOST);
      sleep(SLEEP_TIME);
      let created = cbm.create({desc: 'blabla'}, 'relation');
      let path = cbm.host.concat('/new/fix');
      request('post', path, {json: {command: 'fixtests'}});
      assert(!created);
      done();
    });
  });
});