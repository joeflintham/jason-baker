var should = require('chai').should();
var expect = require('chai').expect;
var jasonBaker = require('../');
var path = require('path');

describe('jason-baker', function(){

  describe('sanity check', function(){

    it('should exist @sanity', function(){
      (typeof jasonBaker).should.equal('function');

      expect(function(){
        var jb = new jasonBaker();
      }).to.throw("Your recipe needs more ingredients.");

      (typeof new jasonBaker(null, null, function(){})).should.equal('object');

    });

  });

  describe('JSON baking with simple JSON objects', function(){

    it('should merge simple JSON objects @json-object', function(done){
      var jsonA = { foo: 'bar' }, jsonB = { bar: 'foo', foo: 'boo' };
      var jsonResult = { foo: 'boo', bar: 'foo' };

      jasonBaker([jsonA, jsonB], {}, function(err, res){
        res.should.deep.equal(jsonResult);
        done();
      });

    });

  });

  describe('JSON baking with complex JSON objects', function(){

    var jsonA =
        {
          foo: 'bar'
        },

        jsonB = {
          foo: 'boo',
          bar: {
            woo: 'hoo'
          }
        },

        jsonC = {
          bar: {
            foo: 'baz'
          }
        },

        jsonD = {
          foo: null,
          bar: null
        };

    var jsonResultABC = { foo: 'boo', bar: { foo: 'baz', woo: 'hoo' } };
    var jsonResultABCD = { foo: null, bar: null };

    it('should merge complex JSON objects @json-object', function(done){

      jasonBaker([jsonA, jsonB, jsonC], {}, function(err, res){
        res.should.deep.equal(jsonResultABC);
        done();
      });

    });

    it('should merge complex JSON objects and null @json-object', function(done){

      jasonBaker([jsonA, jsonB, jsonC, jsonD], {}, function(err, res){
        res.should.deep.equal(jsonResultABCD);
        done();
      });

    });

    it('JSON baking handles a locale test case correctly @json-object @locale-demo', function(done){

      var jsonA = {
        en: {
          buttons: {
            start: 'Start',
            continue: 'Continue'
          }
        }
      };
      var jsonB = {
        en: {
          buttons: {
            continue: 'Go on',
            next: 'Next'
          }
        }
      };
      var jsonResult = {
        en: {
          buttons: {
            start: 'Start',
            continue: 'Go on',
            next: 'Next'
          }
        }
      };

      jasonBaker([jsonA, jsonB], {}, function(err, res){
        res.should.deep.equal(jsonResult);
        done();
      });

    });

  });

  describe('JSON baking with JSON files', function(){

    it('should merge JSON named files @json-file', function(done){

      var jsonA = path.resolve(__dirname, './fixtures/a/jsonA.json'),
          jsonB = path.resolve(__dirname, './fixtures/a/jsonB.json'),
          jsonC = path.resolve(__dirname, './fixtures/a/jsonC.json');

      var jsonResult = require('./fixtures/jsonResult.json');

      jasonBaker([jsonA, jsonB, jsonC], {}, function(err, res){
        res.should.deep.equal(jsonResult);
        done();
      });

    });

    it('JSON baking handles a locale test case correctly @json-file @locale-demo', function(done){

      var jsonA = path.resolve(__dirname, './fixtures/locales/shared/en/default/buttons.json');
      var jsonB = path.resolve(__dirname, './fixtures/locales/private/en/default/buttons.json');

      var jsonResult = require(path.resolve(__dirname, './fixtures/locales/noNamespaceJsonResult.json'));

      jasonBaker([jsonA, jsonB], {}, function(err, res){
        res.should.deep.equal(jsonResult);
        done();
      });

    });

  });

  describe('JSON baking with globbed JSON files', function(){

    it('should merge globbed JSON files from a single glob pattern @json-file @glob', function(done){

      var jsonGLOB = path.resolve(__dirname, './fixtures/a/**/*.json');
      var jsonResult = require('./fixtures/jsonResult.json');

      jasonBaker(jsonGLOB, {}, function(err, res){
        res.should.deep.equal(jsonResult);
        done();
      });

    });


    it('should merge globbed JSON files from an array of glob patterns @json-file @glob @glob-array', function(done){

      var jsonGLOB = [
        path.resolve(__dirname, './fixtures/a/**/*.json'),
        path.resolve(__dirname, './fixtures/b/**/*.json')
      ];
      var jsonResult = require('./fixtures/jsonResult.json');

      jasonBaker(jsonGLOB, {}, function(err, res){
        var keys = Object.keys(res);
        keys.forEach(function(k){
          expect(res[k]).to.equal(null)
        });
        done();
      });

    });

  });

  describe('JSON baking with glob options', function(){

    var jsonGLOB = [
      path.resolve(__dirname, './fixtures/locales/shared/?(en|fr)/**/*.json'),
      path.resolve(__dirname, './fixtures/locales/private/?(en|fr)/**/*.json')
    ];

    var tieredJsonResult = require('./fixtures/locales/tieredNamespaceJsonResult.json');
    var noTieredJsonResult = require('./fixtures/locales/noTieredNamespaceJsonResult.json');

    it('should not tier globbed JSON data when not enabled @json-file @glob @no-tier @locale-demo', function(done){

      jasonBaker(jsonGLOB, {}, function(err, res){
        res.should.deep.equal(noTieredJsonResult);
        done();
      });

    });

    it('should tier globbed JSON data when enabled @json-file @glob @tier @locale-demo', function(done){

      jasonBaker(jsonGLOB, {saltStars:true}, function(err, res){
        (typeof res.en).should.equal("object");
        expect(res).to.have.deep.property('en.default.common.purpose', 'JSON Cake');
        expect(res).to.have.deep.property('en.default.particular.purpose', 'Save the world');
        done();
      });

    });

  });

});
