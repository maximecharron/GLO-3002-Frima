ContentApp.controller("content-controller", function ($scope, contentResource) {


    $scope.updateType= [
        {
            type: "constant",
            commonName: "Base Reference of Bosses"
        },
        {
            type: "current",
            commonName: "In Game bosses stats"
        }
    ];
    $scope.selectedBoss;
    $scope.bosses;
    $scope.selectedUpdateType;

    function init(){

    }


    $scope.updateBoss = function ()
    {

    }

    init();
});
