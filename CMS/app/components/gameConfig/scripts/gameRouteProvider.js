angular.module('CMS.game').config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/game', {
            templateUrl: "components/gameConfig/views/game.html",
            controller: "game-controller"
        })
}]);
