angular.module('CMS.item').config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/item', {
            templateUrl: "components/item/views/item.html",
            controller: "item-controller"
        })
}]);
