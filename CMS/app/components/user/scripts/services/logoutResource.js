angular.module('CMS').factory('logoutResource', ["$resource", function($resource){
    return $resource("https://frima-cms-server.herokuapp.com/logout" , {}, {
        logout:{
            method:'GET'
        }
    });
}]);