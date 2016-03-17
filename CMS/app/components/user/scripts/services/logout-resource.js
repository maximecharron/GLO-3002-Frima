app.factory('logoutResource', ["$resource", function($resource){
    return $resource("http://localhost:3000/logout" , {}, {
        logout:{
            method:'GET'
        }
    });
}]);