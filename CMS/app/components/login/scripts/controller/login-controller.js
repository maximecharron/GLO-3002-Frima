loginApp.controller("login-controller", function ($scope, loginService, $location, loginResource) {

    <!-- $scope déclare les variables utilisées dans le html -->

    $scope.login = function () {

        var credentials = {
            email: $scope.email,
            password: $scope.password
        }

        console.log(credentials);

        //window.alert( $scope.email + " " + $scope.password);

        loginResource.post(credentials, function onSuccess(data) {
            loginService.SetUser(data);
            $location.path("/content");
            console.log("redirecting to content")
        }, function onError(data) {
            console.log(data)
            $location.path("/login");

        });
    }
})
