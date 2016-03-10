'use strict';
var glob = require('glob-promise');
var q = require('q');

var jasonBaker = function(recipe, options, partytime) {

  var flop = null;

  var end = function(jasonCake){
    if (typeof partytime === "function") {
      partytime(flop, jasonCake);
    } else {
      if (flop) { throw flop; }
    }
  };

  var blend = function(base, add){

    Object.keys(add).forEach(function(sequin){
      if (typeof base[sequin] === "object" && typeof add[sequin] === "object" && add[sequin] !== null){
        base[sequin] = blend(base[sequin], add[sequin]);
      } else {
        base[sequin] = add[sequin];
      }
    });

    return base;

  };

  var mix = function(cake, ingredient){

    var batter;

    // check for filename
    if (typeof ingredient === 'string') {
      batter = require(ingredient);

    } else if (ingredient instanceof Array) {
      batter = ingredient.reduce(mix, cake);

    } else if (typeof ingredient === 'object') {
      batter = ingredient;

    } else {
      throw new Error("Your recipes includes ingredients that have gone off.");
    }

    cake = blend(cake, batter);
    return cake;
  };

  var bake = function(ingredients){
    var jasonCake = ingredients.reduce(mix, {});
    end(jasonCake);
  }

  var findStars = function(possibleStar){
    return typeof possibleStar === "string" && possibleStar.match(/\*/);
  }

  var promiseStars = function(stars){
    return glob(stars);
  };




  /* let's bake */
  try {

    if (!recipe) {
      flop = new Error("Your recipe needs more ingredients.");
      end();

    } else if (typeof recipe == "string") {

      if (findStars(recipe)) {
        promiseStars(recipe).then(function(recipes){
          bake(recipes);
        });

      } else {
        recipe = [recipe];
        bake(recipe);
      }

    } else if (recipe instanceof Array) {

      if (recipe.some(findStars)) {

        var stars = function(){
          return q.all(
            recipe.map(promiseStars)
          )
        };

        stars().then(function(recipes){
          bake(recipes);
        })

      } else {
        bake(recipe);
      }

    } else {
      bake(recipe);
    }

  } catch (disaster) {
    flop = disaster;
    end();
  }
}

module.exports = jasonBaker;
