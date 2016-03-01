ContentApp.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/content', {
            templateUrl: "components/content/views/content.html",
            controller: "content-controller"
        })
}]);
