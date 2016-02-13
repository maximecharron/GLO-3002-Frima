ContentApp.controller("content-controller", function ($scope, $http) {

    <!-- $scope déclare les variables utilisées dans le html -->

    var cmsUrl = "http://frima-cms-server.herokuapp.com/update"

    $scope.updateMonsterHealth = function ()
    {
        if(!$scope.monsterHealth){
            window.alert( "not a valid number" );
        }
        else{
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

    function successCallback(){
        window.alert( "Success Callback" );
    }

    function errorCallback(){
        window.alert( "Success Callback" );
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
        };

        xhr.onerror = function() {
            alert('Woops, there was an error making the request.');
        };

        xhr.send(body);
    }
})
