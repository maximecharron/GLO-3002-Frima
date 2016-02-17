ContentApp.factory('contentResource', ["$resource", function($resource){
    return $resource("https://frima-cms-server.herokuapp.com/update",{} ,{
        post:{
            method:"POST"
        }
    });
}]);
