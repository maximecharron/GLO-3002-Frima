angular.module('CMS.item').config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/item', {
            templateUrl: "components/items/views/item.html",
            controller: "item-controller"
        })
}]);
