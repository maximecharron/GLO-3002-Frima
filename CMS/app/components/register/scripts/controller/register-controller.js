angular.module('CMS.register').controller("register-controller", function ($scope, $location, registerResource) {
    $scope.notRegister = true;
    $scope.success = false;
    $scope.error = false;
    $scope.email ="";
    $scope.password ="";
    $scope.name="";

    $scope.register = function () {
        var user = {
            "email": $scope.email,
            "password": $scope.password,
            "name": $scope.name
        };
        registerResource.post(user, function onSuccess(data) {
            $scope.success = true;
        }, function onError(data){
            $scope.error = true;
        });
    }
})
