ContentApp.controller("content-controller", function ($scope, contentResource) {

    <!-- $scope déclare les variables utilisées dans le html -->

    $scope.monsterHealthValue = "Default";
    $scope.monsterSpeedValue = "Default";
    $scope.monsterArmorValue = "Default";

    var MAX_ARMOR = 10
    var MAX_HEALTH = 100
    var MAX_SPEED = 10

    var SET_ARMOR
    var SET_HEALTH
    var SET_SPEED

    var cmsUrl = "http://frima-cms-server.herokuapp.com/update"

    $scope.updateMonsterHealth = function ()
    {
        if(!validateHealth($scope.monsterHealth)){
            window.alert( "not a valid number" );
        }
        else{
            SET_HEALTH = $scope.monsterHealth*1000000;
            var newHealth = {"newBossLife": SET_HEALTH};
            contentResource.post(newHealth, function onSuccess(data){

            }, function onError(data){
                
            })
        }
    }

    $scope.updateMonsterSpeed = function ()
    {
        if(!$scope.monsterSpeed){
            window.alert( "not a valid number" );
        }
        else{
            //TODO: Call
        }

    }

    $scope.updateMonsterArmor = function ()
    {
        if(!$scope.monsterArmor){
            window.alert( "not a valid number" );
        }
        else{
            window.alert( $scope.monsterArmor);
            //TODO: Call
        }

    }


    function validateArmor(armor){
        if(armor <= MAX_ARMOR && validateNaturalNumber(armor)){
            return true
        }
        return false
    }

    function validateHealth(health){
        if(health <= MAX_HEALTH && validateNaturalNumber(health) && health && isInt(health)){
            return true
        }
        return false
    }

    function validateSpeed(speed){
        if(speed <= MAX_SPEED && validateNaturalNumber(speed)){
            return true
        }
        return false
    }

    function isInt(n){
        return n % 1 === 0;
    }


    function validateNaturalNumber(number) {
        if (number > -1 && number != 0) {
            return true
        }
        return false
    }

})
