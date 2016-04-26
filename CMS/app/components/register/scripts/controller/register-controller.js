angular.module('CMS.register').controller("register-controller", function ($scope, $location, registerResource) {
    $scope.success = false;
    $scope.error = false;
    $scope.email ="";
    $scope.password ="";
    $scope.name="";
    $scope.isLoading = false;

    $scope.register = function () {
        $scope.isLoading = true;
        var user = {
            "email": $scope.email,
            "password": $scope.password,
            "name": $scope.name
        };
        registerResource.post(user, function onSuccess(data) {
            $scope.success = true;
            $scope.form.$setPristine();
            $scope.form.$setUntouched();
            $scope.email="";
            $scope.password="";
            $scope.name = "";
            $scope.isLoading = false;
        }, function onError(){
            $scope.isLoading = false;
            $scope.error = true;
        });
    }
})
