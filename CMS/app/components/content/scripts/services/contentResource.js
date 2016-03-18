angular.module('CMS.content', ['ngRoute', 'ngResource']).factory('contentResource', ["$resource", function($resource){
    return $resource("https://frima-cms-server.herokuapp.com/:path",{} ,{
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
