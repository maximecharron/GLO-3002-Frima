var jsdom = require('jsdom').jsdom;

global.document = jsdom('<html><head><script></script></head><body></body></html>');
global.window = global.document.defaultView;
global.navigator = window.navigator = {};
global.Node = window.Node;

global.window.mocha = {};
global.window.beforeEach = beforeEach;
global.window.afterEach = afterEach;

/*
 * Only for Bower users
 */

delete require.cache[require.resolve('../bower_components/angular/angular')];
delete require.cache[require.resolve('../bower_components/angular-mocks')];

require('../bower_components/angular/angular');
require('../bower_components/angular-mocks');
var sinon = require('sinon');

global.angular = window.angular;
module.exports = {
    inject: window.angular.mock.inject,
    module: window.angular.mock.module,
    sinon: sinon
};