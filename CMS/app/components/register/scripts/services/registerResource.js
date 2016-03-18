angular.module('CMS.register', ['ngRoute', 'ngResource']).factory('registerResource', ["$resource", function($resource){
  return $resource("http://localhost:3000/signup" , {}, {
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
}])
