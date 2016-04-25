angular.module('CMS.combo').config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/combo', {
            templateUrl: "components/combo/views/combo.html",
            controller: "combo-controller"
        })
}]);
