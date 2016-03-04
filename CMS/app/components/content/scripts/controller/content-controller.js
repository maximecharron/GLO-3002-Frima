ContentApp.controller("content-controller", function ($scope, contentResource) {


    $scope.updateTypes= [
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

    $scope.bossChanged = function(newBoss){
        $scope.selectedBoss = JSON.parse(newBoss);
    };

    $scope.typeChanged = function(newType){
        newType = JSON.parse(newType);
        if (newType.type=="constant"){
            contentResource.getConstantBoss(function(result){
                $scope.bosses = result;
            });
        } else {
            contentResource.getCurrentBoss(function(result){
                $scope.bosses = result;
            });
        }
    };

    $scope.updateBoss = function ()
    {

    };

});
