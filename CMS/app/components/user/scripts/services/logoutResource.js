angular.module('CMS').factory('logoutResource', ["$resource", "envService", function($resource, envService){
    return $resource(envService.read('apiUrl')+"/logout" , {}, {
        logout:{
            method:'GET'
        }
    });
}]);