loginApp.factory('loginResource', ["$resource", function($resource){
  return $resource("myApiHost" , {}, {
    post:{
      method:"POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  });
}]);
