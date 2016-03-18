angular.module('CMS.login').controller("login-controller", function ($scope, loginService, $location, loginResource) {

    $scope.login = function () {

        var credentials = {
            email: $scope.email,
            password: $scope.password
        };

        loginResource.post(credentials, function onSuccess(data) {
            loginService.setUser(data);
            $location.path("/content");
        }, function onError(data) {
            $location.path("/login");
        });
    }
});
