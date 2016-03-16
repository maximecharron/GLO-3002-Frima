loginApp.controller("login-controller", function ($scope, $location, loginResource) {

    <!-- $scope déclare les variables utilisées dans le html -->

    $scope.login = function () {

        var credentials = {
            email: $scope.email,
            password: $scope.password
        }

        console.log(credentials);

        //window.alert( $scope.email + " " + $scope.password);

        loginResource.post(credentials, function onSuccess(data) {

            $location.path("/content");

        }, function onError(data) {
            $location.path("/login");

        });
    }
})
