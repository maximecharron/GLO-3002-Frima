angular.module('CMS.game').controller("game-controller", function ($scope, gameResource)
{

    $scope.invalidCurrentLife = false;
    $scope.updateSuccess = false;
    $scope.updateError = false;
    $scope.gameBaseStat;


    $scope.init = function ()
    {
        gameResource.getGameBaseStat(function (result)
            {
                $scope.gameBaseStat = result;
            });
    };

    $scope.updateGameBaseStat = function (gameBaseStat)
    {
        $scope.updateError = false;
        $scope.updateSuccess = false;
        var gameBaseStat = {
            baseXP: gameBaseStat.baseXP,
            baseDamage: gameBaseStat.baseDamage,
            ultimateDamage: gameBaseStat.ultimateDamage
        };
        gameResource.updateGameBaseStat(gameBaseStat, function onSuccess(data)
        {
            $scope.gameBaseStat = data;
            $scope.updateSuccess = true;
        }, function onError(data)
        {
            $scope.updateError = true;
        });
    };

    $scope.init();
});
