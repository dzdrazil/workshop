'use strict';

var Ractive = require('ractive');

import {NavBar} from './components/NavBar/NavBarComponent';

export class App {
  constructor() {
    this.rootView = new Ractive({
      el: 'body',
      template: require('./rootView.html'),
      components: {
        NavBar: NavBar
      }
    });
  }
}
