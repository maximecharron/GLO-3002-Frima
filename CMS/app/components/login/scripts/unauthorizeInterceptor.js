app.factory('authHttpResponseInterceptor',['$q','$rootScope', function($q, $location){
        return {
            response: function(response){
                if (response.status === 401) {
                    console.log("Response 401");
                    $location.path('/login');
                }
                return response || $q.when(response);
            },
            responseError: function(rejection) {
                if (rejection.status === 401) {
                    console.log("Response Error 401",rejection);
                    $location.path('/login');
                }
                //return $q.reject(rejection);
            }
        }
    }])
    .config(['$httpProvider',function($httpProvider) {
        $httpProvider.interceptors.push('authHttpResponseInterceptor');
    }]);
