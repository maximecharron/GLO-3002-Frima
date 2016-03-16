app.factory('sessionInjector',['$q', '$cookies', function($q, $cookies){
        var sessionInjector = {
            request: function(request) {
                if (request.url.indexOf("umovie-team01.herokuapp.com") > -1 && request.url.indexOf("auth") == -1 && request.url.indexOf("login") == -1 && request.url.indexOf("logout") == -1 && request.url.indexOf("signup") == -1) {
                    request.headers['authorization'] = $cookies.getObject("user").token;
                }
                return request;
            }
        };
        return sessionInjector;
    }])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('sessionInjector');
    }]);
