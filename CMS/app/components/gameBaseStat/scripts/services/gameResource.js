angular.module('CMS.game', ['ngRoute', 'ngResource', 'environment']).factory('gameResource', ["$resource", 'envService', function($resource, envService){
    return $resource(envService.read('apiUrl')+"/:path",{} ,{
        getGameBaseStat: {
            method:"GET",
            params:{
                path:"gameBaseStat"
            },
            isArray:true
        },
        updateGameBaseStat:{
            method:"POST",
            params: {
                path: "gameBaseStat"
            }
        }
    });
}]);
