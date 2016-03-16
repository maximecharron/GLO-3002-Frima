loginApp.factory('loginResource', ["$resource", function($resource){
  return $resource("localhost:8080/login" , {}, {
    post:{
      method:"POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  });
}]);
