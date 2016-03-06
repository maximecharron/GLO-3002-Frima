ContentApp.controller("content-controller", function ($scope, contentResource) {

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
            contentResource.getConstantBoss(function (result) {
                $scope.bosses = result;
            });
        } else {
            contentResource.getCurrentBoss(function (result) {
                $scope.bosses = result;
            });
        }
    };

    $scope.updateBoss = function (selectedBoss) {
        $scope.updateError = false;
        $scope.updateSucces = false;
        var boss = {
            serverName: selectedBoss.serverName,
            bossName: selectedBoss.bossName,
            currentBossLife: selectedBoss.currentBossLife,
            constantBossLife: selectedBoss.constantBossLife,
            status: selectedBoss.status
        }
        contentResource.updateBoss(boss, function onSuccess(data) {
            $scope.selectedBoss = data;
            $scope.updateSuccess = true;
        }, function onError(data) {
            $scope.updateError = true;
        });
    };

});
