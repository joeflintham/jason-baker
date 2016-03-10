var should = require('chai').should();
var jasonBaker = require('../');
var path = require('path');

describe('jason-baker', function(){

  describe('sanity check', function(){

    it('should exist', function(){
      (typeof jasonBaker).should.equal('function');
      (typeof new jasonBaker()).should.equal('object');
    });

  });

  describe('JSON baking with JSON objects', function(){

    it('should merge simple JSON objects', function(done){
      var jsonA = { foo: 'bar' }, jsonB = { bar: 'foo', foo: 'boo' };
      var jsonResult = { foo: 'boo', bar: 'foo' };

      jasonBaker([jsonA, jsonB], {}, function(err, res){
        res.should.deep.equal(jsonResult);
        done();
      });

    });

    it('should merge complex JSON objects', function(done){
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
          };

      var jsonResult = { foo: 'boo', bar: { foo: 'baz', woo: 'hoo' } };

      jasonBaker([jsonA, jsonB, jsonC], {}, function(err, res){
        res.should.deep.equal(jsonResult);
        done();
      });

    });

  });

  describe('JSON baking with JSON files', function(){

    it('should merge JSON named files', function(done){

      var jsonA = path.resolve(__dirname, './fixtures/jsonA.json'),
          jsonB = path.resolve(__dirname, './fixtures/jsonB.json'),
          jsonC = path.resolve(__dirname, './fixtures/jsonC.json');

      var jsonResult = require('./fixtures/jsonResult.json');

      jasonBaker([jsonA, jsonB, jsonC], {}, function(err, res){
        res.should.deep.equal(jsonResult);
        done();
      });

    });

    it('should merge globbed JSON files', function(done){

      var jsonGLOB = path.resolve(__dirname, './**/*.json');
      var jsonResult = require('./fixtures/jsonResult.json');

      jasonBaker(jsonGLOB, {}, function(err, res){
        res.should.deep.equal(jsonResult);
        done();
      });

    });

  });

});
