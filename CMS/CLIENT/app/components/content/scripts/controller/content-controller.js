ContentApp.controller("content-controller", function ($scope) {

    <!-- $scope déclare les variables utilisées dans le html -->
    $scope.updateMonsterHealth = function ()
    {
        if(!$scope.monsterHealth){
            window.alert( "not a valid number" );
        }
        else{
            window.alert( $scope.monsterHealth );
        }
    }

    $scope.updateMonsterSpeed = function ()
    {
        if(!$scope.monsterSpeed){
            window.alert( "not a valid number" );
        }
        else{
            window.alert( $scope.monsterSpeed);
        }

    }

    $scope.updateMonsterArmor = function ()
    {
        if(!$scope.monsterArmor){
            window.alert( "not a valid number" );
        }
        else{
            window.alert( $scope.monsterArmor);
        }

    }

})
