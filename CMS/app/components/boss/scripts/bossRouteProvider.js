angular.module('CMS.boss').config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/boss', {
            templateUrl: "components/boss/views/boss.html",
            controller: "boss-controller"
        })
}]);
