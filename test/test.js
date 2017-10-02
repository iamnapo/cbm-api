/* eslint-env node, mocha */

'use strict';

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var CallByMeaning = require('../index.js');


describe('CallByMeaning', function tests() {
  describe('config', function test() {
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
        assert(cbm.host === 'http://localhost');
        done();
      });

      it('has default port', function test(done) {
        var cbm = new CallByMeaning();
        assert(cbm.port === 3000);
        done();
      });
    });

    describe('override', function () {
      it('has set hostname', function test(done) {
        var cbm = new CallByMeaning('10.0.0.1', '1234');
        assert(cbm.host === '10.0.0.1');
        done();
      });

      it('has set port', function test(done) {
        var cbm = new CallByMeaning('10.0.0.1', '1234');
        assert(cbm.port === 1234);
        done();
      });

      it('only overrides the version', function test(done) {
        var cbm = new CallByMeaning(null, 50);
        assert(cbm.host === 'http://localhost');
        assert(cbm.port === '50');
        done();
      });
    });

//     describe('.lookup()', function tests() {

//       it('throws an error if not supplied at least two arguments', function test(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         expect(badValue()).to.throw(Error);

//         function badValue() {
//           return function () {
//             cbm.lookup('/c/en/toast');
//           };
//         }
//         done();
//       });

//       it('throws an error if URI argument is not a string primitive', function test(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         var values = [
//           function () {},
//           5,
//           true,
//           undefined,
//           null,
//           NaN, [],
//           {}
//         ];

//         for (var i = 0; i < values.length; i++) {
//           expect(badValue(values[i])).to.throw(TypeError);
//         }

//         function badValue(value) {
//           return function () {
//             cbm.lookup(value, function () {});
//           };
//         }
//         done();
//       });

//       it('throws an error if params argument is not an object', function test(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         var values = [
//           function () {},
//           '5',
//           5,
//           true,
//           undefined,
//           null,
//           NaN, []
//         ];

//         for (var i = 0; i < values.length; i++) {
//           expect(badValue(values[i])).to.throw(TypeError);
//         }

//         function badValue(value) {
//           return function () {
//             cbm.lookup('/c/en/toast', value, function () {});
//           };
//         }
//         done();
//       });

//       it('throws an error if callback argument is not a function', function test(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         var values = [
//           '5',
//           5,
//           true,
//           undefined,
//           null,
//           NaN, [],
//           {}
//         ];

//         for (var i = 0; i < values.length; i++) {
//           expect(badValue(values[i])).to.throw(TypeError);
//         }

//         function badValue(value) {
//           return function () {
//             cbm.lookup('/c/en/toast', value);
//           };
//         }
//         done();
//       });


//       it('looks up a single concept URI', function test(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         cbm.lookup('/c/en/toast', {
//           offset: 0
//         }, function onDone(err, result) {
//           assert(result.numFound > 0);
//           done();
//         });
//       });

//       it('looks up a single concept URI with filter', function test(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         cbm.lookup('/c/en/toast', {
//           offset: 0,
//           filter: 'core'
//         }, function onDone(err, result) {
//           assert(result.numFound > 0);
//           done();
//         });
//       });

//       it('looks up a single concept URI with custom limit', function test(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         cbm.lookup('/c/en/toast', {
//           limit: 2,
//           offset: 0,
//           filter: 'core'
//         }, function onDone(err, result) {
//           assert(result.edges.length === 2);
//           done();
//         });
//       });

//       it('handles concepts in other languages', function otherLangTest(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         cbm.lookup('/c/ja/車', {
//           filter: 'core'
//         }, function onDone(err, result) {
//           assert(result.edges.length === 50);
//           done();
//         });
//       });
//     });

//     describe('.search()', function tests() {

//       it('throws an error if params argument is not an object', function test(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         var values = [
//           '5',
//           5,
//           true,
//           undefined,
//           null,
//           NaN, [],
//           function () {}
//         ];

//         for (var i = 0; i < values.length; i++) {
//           expect(badValue(values[i])).to.throw(TypeError);
//         }

//         function badValue(value) {
//           return function () {
//             cbm.search(value, function onDone() {});
//           };
//         }
//         done();
//       });

//       it('throws an error if callback argument is not a function', function test(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         var values = [
//           '5',
//           5,
//           true,
//           undefined,
//           null,
//           NaN, [],
//           {}
//         ];

//         for (var i = 0; i < values.length; i++) {
//           expect(badValue(values[i])).to.throw(TypeError);
//         }

//         function badValue(value) {
//           return function () {
//             cbm.search({
//               start: '/c/en/donut'
//             }, value);
//           };
//         }
//         done();
//       });

//       it('is possible to use search method to find CallByMeaning edges for multiple requirements', function test(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         cbm.search({
//           start: '/c/en/donut'
//         }, function onDone(err, result) {
//           assert(result.numFound > 0);
//           done();
//         });
//       });

//     });

//     describe('.getURI()', function tests() {

//       it('throws an error if not supplied at least two arguments', function test(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         expect(badValue()).to.throw(Error);

//         function badValue() {
//           return function () {
//             cbm.getURI('ground beef');
//           };
//         }
//         done();
//       });

//       it('throws an error if first argument is not a string primitive', function test(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         var values = [
//           function () {},
//           5,
//           true,
//           undefined,
//           null,
//           NaN, [],
//           {}
//         ];

//         for (var i = 0; i < values.length; i++) {
//           expect(badValue(values[i])).to.throw(TypeError);
//         }

//         function badValue(value) {
//           return function () {
//             cbm.getURI(value, function () {});
//           };
//         }
//         done();
//       });

//       it('throws an error if language argument is not a string primitive', function test(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         var values = [
//           function () {},
//           5,
//           true,
//           undefined,
//           null,
//           NaN, [],
//           {}
//         ];

//         for (var i = 0; i < values.length; i++) {
//           expect(badValue(values[i])).to.throw(TypeError);
//         }

//         function badValue(value) {
//           return function () {
//             cbm.getURI('車', value, function () {});
//           };
//         }
//         done();
//       });

//       it('throws an error if callback argument is not a function', function test(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         var values = [
//           '5',
//           5,
//           true,
//           undefined,
//           null,
//           NaN, [],
//           {}
//         ];

//         for (var i = 0; i < values.length; i++) {
//           expect(badValue(values[i])).to.throw(TypeError);
//         }

//         function badValue(value) {
//           return function () {
//             cbm.getURI('ground beef', value);
//           };
//         }
//         done();
//       });

//       it('looks up the CallByMeaning URI for text (english)', function test(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         cbm.getURI('ground beef', function onDone(err, result) {
//           assert(result.uri === '/c/en/grind_beef');
//           done();
//         });
//       });

//       it('looks up the CallByMeaning URI for text (foreign language)', function test(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         cbm.getURI('車', 'ja', function onDone(err, result) {
//           assert(result.uri === '/c/ja/車');
//           done();
//         });
//       });
//     });

//     describe('.association()', function tests() {

//       it('throws an error if not supplied at least two arguments', function test(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         expect(badValue()).to.throw(Error);

//         function badValue() {
//           return function () {
//             cbm.association('/c/en/hotdog');
//           };
//         }
//         done();
//       });

//       it('throws an error if params argument is not an object', function test(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         var values = [
//           function () {},
//           '5',
//           5,
//           true,
//           undefined,
//           null,
//           NaN, []
//         ];

//         for (var i = 0; i < values.length; i++) {
//           expect(badValue(values[i])).to.throw(TypeError);
//         }

//         function badValue(value) {
//           return function () {
//             cbm.association('/c/en/hotdog', value, function () {});
//           };
//         }
//         done();
//       });


//       it('throws an error if callback argument is not a function', function test(done) {
//         this.timeout(2000);
//         var cbm = new CallByMeaning();
//         var values = [
//           '5',
//           5,
//           true,
//           undefined,
//           null,
//           NaN, [],
//           {}
//         ];

//         for (var i = 0; i < values.length; i++) {
//           expect(badValue(values[i])).to.throw(TypeError);
//         }

//         function badValue(value) {
//           return function () {
//             cbm.association('/c/en/hotdog', {
//               filter: '/c/en/donut'
//             }, value);
//           };
//         }
//         done();
//       });

//       it('is possible to retrieve associations', function test(done) {
//         this.timeout(3000);
//         var cbm = new CallByMeaning();
//         cbm.association('/c/en/hotdog', {
//             filter: '/c/en/donut'
//           },
//           function onDone(err, result) {
//             assert(result.similar.length > 0);
//             done();
//           });
//       });

//       it('is possible to retrieve associations with limit', function test(done) {
//         this.timeout(3000);
//         var cbm = new CallByMeaning();
//         cbm.association('/c/en/cat', {
//           limit: 1,
//           filter: '/c/en/dog'
//         }, function onDone(err, result) {
//           assert(result.similar.length === 1);
//           done();
//         });
//       });

//       it('is possible to retrieve associations for term list', function test(done) {
//         this.timeout(3000);
//         var cbm = new CallByMeaning();
//         cbm.association('/list/en/toast,cereal', function onDone(err, result) {
//           assert(result.similar.length > 0);
//           done();
//         });
//       });

//       it('throws an error when not supplying concept URI or path to association', function test(done) {
//         this.timeout(3000);
//         expect(badValue()).to.throw(Error);

//         function badValue() {
//           return function () {
//             var cbm = new CallByMeaning();
//             cbm.association('hotdog', {
//               limit: 10,
//               filter: '/c/en/donut'
//             }, function onDone() {});
//           };
//         }
//         done();
//       });

//       it('throws an error when not supplying concept URI to filter options', function test(done) {
//         this.timeout(3000);
//         expect(badValue()).to.throw(Error);

//         function badValue() {
//           return function () {
//             var cbm = new CallByMeaning();
//             cbm.association('/c/en/hotdog', {
//               limit: 10,
//               filter: 'donut'
//             }, function onDone() {});
//           };
//         }
//         done();
//       });
//     });

//   });
// });