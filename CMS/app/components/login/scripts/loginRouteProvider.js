angular.module('CMS.login').config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/login', {
            templateUrl: "components/login/views/login.html",
            controller: "login-controller"
        })
            .otherwise({redirectTo: '/login'});
    }]);
