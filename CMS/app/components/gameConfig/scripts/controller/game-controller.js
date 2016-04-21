angular.module('CMS.game').controller("game-controller", function ($scope, gameResource)
{

    $scope.updateSuccess = false;
    $scope.updateError = false;
    $scope.gameConfig;


    $scope.init = function ()
    {
        gameResource.getGameConfig(function (result)
            {
                $scope.gameConfig = result;
            });
    };

    $scope.updateGameConfig = function (gameConfig)
    {
        $scope.updateError = false;
        $scope.updateSuccess = false;
        var gameConfig = {
            baseExperienceIncreaseOnHit: gameConfig.baseExperienceIncreaseOnHit,
            baseAttackDamage: gameConfig.baseAttackDamage,
            hypeAttackDamage: gameConfig.hypeAttackDamage
        };
        gameResource.updateGameConfig(gameConfig, function onSuccess(data)
        {
            $scope.gameConfig = data;
            $scope.updateSuccess = true;
        }, function onError(data)
        {
            $scope.updateError = true;
        });
    };

    $scope.init();
});
