'use strict';
var glob = require('glob-promise');
var q = require('q');

var jasonBaker = function(recipe, options, callback) {

  var err = null;

  var end = function(jasonCake){
    if (typeof callback === "function") {
      callback(err, jasonCake);
    } else {
      if (err) { throw err; }
    }
  };

  var blend = function(base, add){

    Object.keys(add).forEach(function(key){
      if (typeof base[key] === "object" && typeof add[key] === "object" && add[key] !== null){
        base[key] = blend(base[key], add[key]);
      } else {
        base[key] = add[key];
      }
    });

    return base;

  };

  var mix = function(cake, ingredient, index, array){

    var batter;

    // check for filename
    if (typeof ingredient === 'string') {
      batter = require(ingredient);

    } else if (ingredient instanceof Array) {
      batter = ingredient.reduce(mix, cake);

    } else if (typeof ingredient === 'object') {
      batter = ingredient;

    } else {
      throw new Error("Invalid arguments");
    }

    cake = blend(cake, batter);
    return cake;
  };

  var bake = function(ingredients){
    var jasonCake = ingredients.reduce(mix, {});
    end(jasonCake);
  }

  var matchGlob = function(str){
    return typeof str === "string" && str.match(/\*/);
  }

  var promiseGlob = function(pattern){
    return glob(pattern)
  };





  try {

    if (!recipe) {
      err = new Error("Missing arguments");
      end();

    } else if (typeof recipe == "string") {

      if (matchGlob(recipe)) {
        promiseGlob(recipe).then(function(recipes){
          bake(recipes);
        });

      } else {
        recipe = [recipe];
        bake(recipe);
      }

    } else if (recipe instanceof Array) {

      if (recipe.some(matchGlob)) {

        var globAll = function(){
          return q.all(
            recipe.map(promiseGlob)
          )
        };

        globAll().then(function(recipes){
          bake(recipes);
        })

      } else {
        bake(recipe);
      }

    } else {
      bake(recipe);
    }

  } catch (e) {
    err = e;
    end();
  }
}

module.exports = jasonBaker;
