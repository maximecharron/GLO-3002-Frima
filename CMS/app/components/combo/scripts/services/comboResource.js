angular.module('CMS.combo', ['ngRoute', 'ngResource', 'environment']).factory('comboResource', ["$resource", 'envService', function($resource, envService){
    return $resource(envService.read('apiUrl')+"/:path",{} ,{

    });
}]);
