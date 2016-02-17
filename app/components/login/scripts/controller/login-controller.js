loginApp.controller("login-controller", function ($scope, loginService, $location, loginResource) {

    <!-- $scope déclare les variables utilisées dans le html -->

    $scope.signin = function () {

        var data = {
            email: $scope.email,
            password: $scope.password
        }

        window.alert( $scope.email + " " + $scope.password);
    }
})
