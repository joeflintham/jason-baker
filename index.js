'use strict';

var jasonBaker = require('./lib/jason-baker');

jasonBaker.promise = function jasonBakerPromise(recipe, options) {
  /* eslint no-undef: 0 */
  return new Promise(function makePromise(party, poop) {
    jasonBaker(recipe, options, function whatsPromised(flop, cake) {
      return flop === null ? party(cake) : poop(flop);
    });
  });
};

module.exports = jasonBaker;
