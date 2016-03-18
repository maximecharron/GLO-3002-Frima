angular.module('CMS.content', ['ngRoute', 'ngResource', 'environment']).factory('contentResource', ["$resource", 'envService', function($resource, envService){
    return $resource(envService.read('apiUrl')+"/:path",{} ,{
        getConstantBosses: {
            method:"GET",
            params:{
                path:"bossesConstant"
            },
            isArray:true
        },
        getCurrentBosses: {
            method:"GET",
            params:{
                path:"bosses"
            },
            isArray:true
        },
        updateBoss:{
            method:"POST",
            params: {
                path: "update"
            }
        }
    });
}]);
