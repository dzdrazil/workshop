'use strict';

export class Router {
  constructor() {
    this.routes = {};

    this.currentRoute = '';
  }

  gotoRoute(name) {
    if (!this.routes[name]) {
      throw new RangeError('Route ' + name + ' is not registered');
    }

    this.currentRoute = name;
  }

  addRoute(name, path) {
    if (this.routes[name]) {
      throw new RangeError('Route ' + name + ' has already been registered');
    }

    this.routes[name] = path;
  }
}
