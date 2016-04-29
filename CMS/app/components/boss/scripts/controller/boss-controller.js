angular.module('CMS.boss').controller("boss-controller", function ($scope, bossResource)
{

    $scope.invalidCurrentLife = false;
    $scope.updateSuccess = false;
    $scope.updateError = false;
    $scope.isBossesLoading = false;
    $scope.isUpdating = false;
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


    $scope.typeChanged = function ()
    {
        $scope.isBossesLoading = true;
        if ($scope.selectedUpdateType.type == "constant")
        {
            bossResource.getConstantBosses(function (result)
            {
                $scope.bosses = result;
                $scope.isBossesLoading = false;
            });
        } else
        {
            bossResource.getCurrentBosses(function (result)
            {
                $scope.bosses = result;
                $scope.isBossesLoading = false;
            });
        }
    };

    $scope.isValidCurrentLife = function (current)
    {
        var maximum = $scope.selectedBoss.maximumBossLife;
        if (current > maximum)
        {
            $scope.invalidCurrentLife = true;
            return false;
        } else
        {
            $scope.invalidCurrentLife = false;
            return true;
        }
    };

    $scope.updateBoss = function (selectedBoss)
    {
        $scope.updateError = false;
        $scope.updateSuccess = false;
        $scope.isUpdating = true;
        var boss = {
            serverName: selectedBoss.serverName,
            bossName: selectedBoss.bossName,
            currentBossLife: selectedBoss.currentBossLife,
            maximumBossLife: selectedBoss.maximumBossLife,
            status: selectedBoss.status
        };
        bossResource.updateBoss(boss, function onSuccess(data)
        {
            $scope.selectedBoss = data;
            convertLifeToNumber();
            $scope.updateSuccess = true;
            $scope.isUpdating = false;
        }, function onError(data)
        {
            $scope.isUpdating = false;
            $scope.updateError = true;
        });
    };
    function convertLifeToNumber()
    {
        $scope.selectedBoss.currentBossLife = parseInt($scope.selectedBoss.currentBossLife);
        $scope.selectedBoss.maximumBossLife = parseInt($scope.selectedBoss.maximumBossLife);
    };
});
