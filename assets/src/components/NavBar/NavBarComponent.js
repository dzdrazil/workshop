'use strict';

var Ractive = require('ractive');

export var NavBar = Ractive.extend({
  el: 'div',
  template: require('./NavBarTemplate.html')
});
console.log(NavBar);
