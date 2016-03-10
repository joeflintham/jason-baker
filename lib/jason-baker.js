'use strict';
var glob = require('glob-promise');
var q = require('q');

var jasonBaker = function(args, options, callback) {

  var err = null;

  var quit = function(jasonCake){
    if (typeof callback === "function") {
      callback(err, jasonCake);
    } else {
      if (err) { throw err; }
    }
  };

  var merge = function(target, source){

    Object.keys(source).forEach(function(key){
      if (typeof target[key] === "object" && typeof source[key] === "object" && source[key] !== null){
        target[key] = merge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    });

    return target;

  };

  var parse = function(cake, item, index, array){

    var data;

    // check for filename
    if (typeof item === 'string') {
      data = require(item);

    } else if (item instanceof Array) {
      data = item.forEach(parse);

    } else if (typeof item === 'object') {
      data = item;

    } else {
      throw new Error("Invalid arguments");
    }

    cake = merge(cake, data);
    return cake;
  };

  var bake = function(ingredients){
    var jasonCake;
    try {
      jasonCake = ingredients.reduce(parse, {});
    } catch (e) {
      err = e;
    }
    quit(jasonCake);
  }

  var matchGlob = function(str){
    return typeof str === "string" && str.match(/\*/);
  }

  var bakeGlob = function(pattern){
    return glob(pattern)
  };

  if (!args) {
    err = new Error("Missing arguments");
    quit();

  } else if (typeof args == "string") {

    if (args.match(/\*/)) {
      // got a glob
      glob(args, {}, function(err, fileList) {
        args = fileList;
        bake();
      });

    } else {
      args = [args];
      bake();
    }
  } else {
    bake();
  }

}

module.exports = jasonBaker;
