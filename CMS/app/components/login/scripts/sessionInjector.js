angular.module('CMS').factory('sessionInjector',['$q', '$cookies', 'envService', function($q, $cookies, envService){
        var sessionInjector = {
            request: function(request) {
                if (request.url.indexOf(envService.read('apiUrl')) > -1 && request.url.indexOf("login") == -1 && request.url.indexOf("logout") == -1) {
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
