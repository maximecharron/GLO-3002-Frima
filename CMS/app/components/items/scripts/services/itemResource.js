angular.module('CMS.item', ['ngRoute', 'ngResource', 'environment']).factory('itemResource', ["$resource", 'envService', function($resource, envService){
    return $resource(envService.read('apiUrl')+"/:path/:id",{} ,{
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
                path:"items",
                id:"@id"
            }
        },
        updateItem:{
            method:"POST",
            params: {
                path: "items"
            }
        },
        newItem:{
            method:"PUT",
            params: {
                path: "items"
            }
        }
    });
}]);
