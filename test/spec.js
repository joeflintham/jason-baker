var should = require('chai').should();
var jasonBaker = require('../');

describe('jason-baker', function(){

  it('should exist', function(){
    (typeof jasonBaker).should.equal('function');
    (typeof new jasonBaker).should.equal('object');
  });

});
