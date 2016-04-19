angular.module('CMS.item', ['ngRoute', 'ngResource', 'environment']).factory('itemResource', ["$resource", 'envService', function($resource, envService){
    return $resource(envService.read('apiUrl')+"/:path",{} ,{
        getItems: {
            method:"GET",
            params:{
                path:"items"
            },
            isArray:true
        },
        deleteItem: {
            method:"DELETE",
            params:{
                path:"items"
            },
        },
        updateItem:{
            method:"POST",
            params: {
                path: "items"
            }
        }
    });
}]);
