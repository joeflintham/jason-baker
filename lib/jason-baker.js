'use strict';
var glob = require('glob-promise');
var q = require('q');

var jasonBaker = function jasonBaker(recipe, options, partytime) {
  var flop = null;

  var end = function end(jasonCake) {
    if (typeof partytime === 'function') {
      partytime(flop, jasonCake);
    } else {
      if (flop) {
        throw flop;
      }
    }
  };

  var blend = function blend(base, add) {
    Object.keys(add).forEach(function whisk(sequin) {
      var bothBlend = (typeof base[sequin] === 'object' && typeof add[sequin] === 'object');
      if (bothBlend && add[sequin] !== null) {
        /* eslint no-param-reassign: 0 */
        base[sequin] = blend(base[sequin], add[sequin]);
      } else {
        base[sequin] = add[sequin];
      }
    });

    return base;
  };

  var createMixer = function createMixer(salt) {
    return function mix(cake, ingredient) {
      var batter;

      // check for filename
      if (typeof ingredient === 'string') {
        batter = require(ingredient);

        if (salt) {
          /* eslint vars-on-top: 0 */
          var saltShaker = function saltShaker(granule) {
            return ingredient.indexOf(granule) > -1;
          };

          var decorate = function decorate(cakeMix, decoration) {
            var freshMix = {};
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
        throw new Error('Your recipes includes ingredients that have gone off.');
      }

      cake = blend(cake, batter);
      return cake;
    };
  };

  var magic = /[^a-zA-Z0-9_\-\/].+$/;

  var findStars = function decorate(possibleStar) {
    return typeof possibleStar === 'string' && possibleStar.match(magic);
  };

  var promiseStars = function promiseStars(stars) {
    return glob(stars);
  };

  var findStarRoot = function findStarRoot(starRoots, stars) {
    var starRoot = stars.replace(magic, '');
    starRoots.push(starRoot);
    return starRoots;
  };

  var bake = function bake(ingredients, salt) {
    var mixer = createMixer(salt);
    var jasonCake = ingredients.reduce(mixer, {});
    end(jasonCake);
  };

  /* let's bake */
  try {
    if (!recipe) {
      flop = new Error('Your recipe needs more ingredients.');
      end();
    } else if (typeof recipe === 'string') {
      if (findStars(recipe)) {
        promiseStars(recipe).then(function bakeCake(recipes) {
          bake(recipes);
        });
      } else {
        recipe = [recipe];
        bake(recipe);
      }
    } else if (recipe instanceof Array) {
      if (recipe.some(findStars)) {
        var stars = function stars() {
          return q.all(
            recipe.map(promiseStars)
          );
        };

        stars().then(function bakeCakes(recipes) {
          var starRoots;
          if (options.saltStars) {
            starRoots = recipe.reduce(findStarRoot, []);
          }

          bake(recipes, starRoots);
        });
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
};

module.exports = jasonBaker;
