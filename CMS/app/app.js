'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('CMS', [
    'ngRoute',
    'ngResource',
    'ngCookies',
    'ui.validate',
    'environment',
    "CMS.content",
    "CMS.login",
    "CMS.register"
]).config(function(envServiceProvider) {
        envServiceProvider.config({
            domains: {
                development: ['localhost', 'dev.local'],
                production: ['herokuapp.com']
            },
            vars: {
                development: {
                    apiUrl: 'http://localhost:3000',
                },
                production: {
                    apiUrl: 'https://frima-cms-server.herokuapp.com',
                }
            }
        });

        envServiceProvider.check();
    }).run(['$rootScope', '$cookies', '$location', function ($rootScope, $cookies, $location) {

    if ($cookies.getObject('user') != null) {
        $rootScope.user = $cookies.getObject('user');
    }

    $rootScope.$on("$routeChangeStart", function (event, next, current) {

        if ($cookies.getObject('user') == null) {
            if (next.templateUrl != "components/login/views/login.html" && next.templateUrl != "components/register/views/register.html") {
                // not going to #login, we should redirect now
                $location.path("/login");
            }
        } else if (next.templateUrl == "components/login/views/login.html"){
            $location.path("/content");
        } else if (next.templateUrl == "components/register/views/register.html" && !$rootScope.user.isSuperAdmin){
            $location.path("/content");
        }
    });
}]);
