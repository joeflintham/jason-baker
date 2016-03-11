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

    it('should use globbed dir/filenames to namespace JSON data @json-file @glob @namespace', function(done){

      var jsonGLOB = [
        path.resolve(__dirname, './fixtures/a/**/*.json'),
        path.resolve(__dirname, './fixtures/b/**/*.json')
      ];
      var jsonResult = require('./fixtures/jsonResult.json');

      jasonBaker(jsonGLOB, {starsToTiers:true}, function(err, res){
        var keys = Object.keys(res);
        keys.forEach(function(k){
          expect(res[k]).to.equal(null)
        });
        done();
      });

    });

  });

});
