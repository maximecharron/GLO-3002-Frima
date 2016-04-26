angular.module('CMS.login').controller("login-controller", function ($scope, loginService, $location, loginResource) {
    $scope.loginError = false;
    $scope.isLoading = false;
    $scope.login = function () {
        $scope.isLoading = true;
        var credentials = {
            email: $scope.email,
            password: $scope.password
        };

        loginResource.post(credentials, function onSuccess(data) {
            if (!data){
                $scope.isLoading = false;
                $scope.loginError = false;
                $location.path("/login");
            } else {
                $scope.isLoading = false;
                loginService.setUser(data);
                $location.path("/bosses");
            }
        }, function onError(data) {
            $scope.isLoading = false;
            $scope.loginError = true;
            $location.path("/login");
        });
    }
});
