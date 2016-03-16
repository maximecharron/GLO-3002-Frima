'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('CMS', [
    'ngRoute',
    'ngResource',
    'ngCookies',
    "CMS.content",
    "CMS.login"
]);
