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

  var createMixer = function(salt){

    return function mix(cake, ingredient){

      var batter;

      // check for filename
      if (typeof ingredient === 'string') {
        batter = require(ingredient);

        if (salt) {

          var saltShaker = function(granule){
            return ingredient.indexOf(granule) > -1;
          };

          var decorate = function(cakeMix, decoration){
            var freshMix = {}
            freshMix[decoration] = cakeMix;
            return freshMix;
          };

          var grain = salt.filter(saltShaker);
          var decorations = ingredient.replace('.json', '').replace(grain, '').split('/').reverse();
          batter = decorations.reduce(decorate, batter);
        }

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

  }

  var findStars = function(possibleStar){
    return typeof possibleStar === "string" && possibleStar.match(/\*/);
  }

  var promiseStars = function(stars){
    return glob(stars);
  };

  var findStarRoot = function(starRoots, stars){
    var magic = /[^a-zA-Z0-9_\-\/].+$/;
    var starRoot = stars.replace(magic, '');
    starRoots.push(starRoot);
    return starRoots;
  };

  var bake = function(ingredients, salt){
    var mixer = createMixer(salt);
    var jasonCake = ingredients.reduce(mixer, {});
    end(jasonCake);
  }

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
          var starRoots;
          if (options.saltStars) {
            starRoots = recipe.reduce(findStarRoot, []);
          }
          bake(recipes, starRoots);
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
