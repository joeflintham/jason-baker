'use strict';

var jasonBaker = function(args, options, callback) {

  var err = null, jasonCake = null;

  var quit = function(){
    if (typeof callback === "function") {
      callback(err, jasonCake);
    } else {
      if (err) { throw err; }
    }
  };

  var merge = function(target, source){

    Object.keys(source).forEach(function(key){
      if (typeof target[key] === "object" && typeof source[key] === "object"){
        target[key] = merge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    });

    return target;

  };
  
  var parseItem = function(cake, item, index, array){

    var data;
    // check for filename
    if (typeof item === 'string') {
      data = require(item);
    } else if (item instanceof Array) {
      data = item.forEach(parseItem);

    } else if (typeof item === 'object') {
      data = item;

    } else {
      throw new Error("Invalid arguments");
    }

    cake = merge(cake, data);
    return cake;
  };

  if (!args) {
    quit();
    return;
  }
  
  try {
    jasonCake = args.reduce(parseItem, {});
  } catch (e) {
    err = e;
  }

  quit();
}

module.exports = jasonBaker;
