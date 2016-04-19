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
global.angular = window.angular;
require('../bower_components/angular-mocks');
require('../bower_components/angular-environment/dist/angular-environment');
require('../bower_components/angular-route/angular-route');
require('../bower_components/angular-resource/angular-resource');

var sinon = require('sinon');
module.exports = {
    inject: window.angular.mock.inject,
    module: window.angular.mock.module,
    sinon: sinon
};