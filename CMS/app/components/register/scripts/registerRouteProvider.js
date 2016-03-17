app.
    config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/register', {
            templateUrl: "components/register/views/register.html",
            controller: "register-controller"
        });
    }]);
