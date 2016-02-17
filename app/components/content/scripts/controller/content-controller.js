ContentApp.controller("content-controller", function ($scope, $http) {

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
            SET_HEALTH = $scope.monsterHealth
            makeCorsRequest('POST', cmsUrl, $scope.monsterHealth);
        }
    }

    $scope.updateMonsterSpeed = function ()
    {
        if(!$scope.monsterSpeed){
            window.alert( "not a valid number" );
        }
        else{
            makeCorsRequest('POST', cmsUrl, $scope.monsterSpeed);
        }

    }

    $scope.updateMonsterArmor = function ()
    {
        if(!$scope.monsterArmor){
            window.alert( "not a valid number" );
        }
        else{
            window.alert( $scope.monsterArmor);
            makeCorsRequest('POST', cmsUrl, $scope.monsterSpeed);
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

    function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            xhr.open(method, url, true);

        } else if (typeof XDomainRequest != "undefined") {

            xhr = new XDomainRequest();
            xhr.open(method, url);

        } else {

            xhr = null;

        }
        return xhr;
    }

    function makeCorsRequest(request, url, body) {

        var xhr = createCORSRequest('POST', url);

        if (!xhr) {
            alert('CORS not supported');
            return;
        }
        xhr.onload = function() {
            var text = xhr.responseText;
            alert('Response from CORS request to ' + url + ': '+ text);
            $scope.monsterHealthValue = SET_HEALTH
        };

        xhr.onerror = function() {
            alert('Woops, there was an error making the request.');
        };

        xhr.send(body);
    }
})
