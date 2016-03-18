angular.module('CMS.content').controller("content-controller", function ($scope, contentResource) {

    $scope.invalidCurrentLife = false;
    $scope.updateSuccess = false;
    $scope.updateError = false;
    $scope.updateTypes = [
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

    $scope.bossChanged = function (newBoss) {
        $scope.selectedBoss = JSON.parse(newBoss);
    };

    $scope.typeChanged = function (newType) {
        newType = JSON.parse(newType);
        if (newType.type == "constant") {
            contentResource.getConstantBosses(function (result) {
                $scope.bosses = result;
            });
        } else {
            contentResource.getCurrentBosses(function (result) {
                $scope.bosses = result;
            });
        }
    };

    $scope.isValidCurrentLife = function(current){
        var maximum = $scope.selectedBoss.maximumBossLife;
        if (current > maximum){
            $scope.invalidCurrentLife = true;
            return false;
        } else {
            $scope.invalidCurrentLife = false;
            return true;
        }
    };

    $scope.updateBoss = function (selectedBoss) {
        $scope.updateError = false;
        $scope.updateSuccess = false;
        var boss = {
            serverName: selectedBoss.serverName,
            bossName: selectedBoss.bossName,
            currentBossLife: selectedBoss.currentBossLife,
            maximumBossLife: selectedBoss.maximumBossLife,
            status: selectedBoss.status
        };
        contentResource.updateBoss(boss, function onSuccess(data) {
            $scope.selectedBoss = data;
            $scope.updateSuccess = true;
        }, function onError(data) {
            $scope.updateError = true;
        });
    };

});
