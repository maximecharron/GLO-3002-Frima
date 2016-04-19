angular.module('CMS.login', ['ngRoute', 'ngCookies', 'ngResource', 'environment']).factory('loginResource', ["$resource", "envService", function($resource, envService){
  return $resource(envService.read('apiUrl')+"/login" , {}, {
    post:{
      method:"POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformRequest: function (data, headersGetter) {
        var str = [];
        for (var d in data)
          str.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
        return str.join("&");
      }
    }
  });
}]);
