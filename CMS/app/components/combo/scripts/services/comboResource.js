angular.module('CMS.combo', ['ngRoute', 'ngResource', 'environment']).factory('comboResource', ["$resource", 'envService', function($resource, envService){
    return $resource(envService.read('apiUrl')+"/:path/:id",{} ,{
        getCombos: {
            method:"GET",
            params:{
                path:"combos"
            },
            isArray:true
        },
        deleteCombo: {
            method:"DELETE",
            params:{
                path:"combos",
                id: '@id'
            },
        },
        updateCombo:{
            method:"POST",
            params: {
                path: "combos"
            }
        },
        newCombo:{
            method:"PUT",
            params: {
                path: "combos"
            }
        }

    });
}]);
