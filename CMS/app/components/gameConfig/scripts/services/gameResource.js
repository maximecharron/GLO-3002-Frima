angular.module('CMS.game', ['ngRoute', 'ngResource', 'environment']).factory('gameResource', ["$resource", 'envService', function($resource, envService){
    return $resource(envService.read('apiUrl')+"/:path",{} ,{
        getGameConfig: {
            method:"GET",
            params:{
                path:"gameConfig"
            },
            isArray:true
        },
        updateGameConfig:{
            method:"POST",
            params: {
                path: "gameConfig"
            }
        }
    });
}]);
