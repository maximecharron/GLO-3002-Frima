//return $resource("localhost:3000/:path",{} ,{

ContentApp.factory('contentResource', ["$resource", function($resource){
    return $resource("http://localhost:3000/:path",{} ,{
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
