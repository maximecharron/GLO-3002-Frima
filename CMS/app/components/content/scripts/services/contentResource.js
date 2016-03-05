ContentApp.factory('contentResource', ["$resource", function($resource){
    return $resource("https://frima-cms-server.herokuapp.com/:path",{} ,{
        getConstantBoss: {
            method:"GET",
            params:{
                path:"bossesConstant"
            },
            isArray:true
        },
        getCurrentBoss: {
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
