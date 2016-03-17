loginApp.controller("login-controller", function ($scope, loginService, $location, loginResource) {

    <!-- $scope déclare les variables utilisées dans le html -->

    $scope.login = function () {

        var credentials = {
            email: $scope.email,
            password: $scope.password
        }

        loginResource.post(credentials, function onSuccess(data) {
            loginService.setUser(data);
            $location.path("/content");
        }, function onError(data) {
            $location.path("/login");
        });
    }
})
