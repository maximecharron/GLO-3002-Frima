angular.module('CMS.game').controller("game-controller", function ($scope, gameResource)
{

    $scope.updateSuccess = false;
    $scope.updateError = false;
    $scope.gameConfig;
    $scope.counterAdd = 0;
    $scope.numberOfItems = 0;


    $scope.init = function ()
    {
        gameResource.getGameConfig(function (result)
            {
                extractLevelsAndItems(result);
                extractProbability(result);
            });
    };

    function extractLevelsAndItems(result){
        $scope.gameConfig = result;
        var levels = [];
        for (var i = 0; i < result.experiencePerLevel.length; i++){
            levels.push({
                XP: result.experiencePerLevel[i],
                level: i,
                upgradePoints: result.upgradePointsPerLevel[i]
            });
        }
        $scope.gameConfig.levels = levels;
    }

    function extractProbability(result){
        var itemsProbability = [];
        var counter = 1;
        for (var i = 1; i<100; i++){
            if (result.probabilityLoot[i-1] != result.probabilityLoot[i]){
                itemsProbability.push({value:counter});
                counter = 0;
            } else {
                counter++;
            }
        }
        if (itemsProbability.length == 0){
            for (var  i = 0; i< result.probabilityLoot[0]-1; i++){
                itemsProbability.push({value: 0});
            }
            itemsProbability.push({value:counter});
        }
       $scope.gameConfig.probabilityLoot = itemsProbability;
    }

    function createLootArray(lootStats){
        var lootArray = [];
        for (var i = 0; i<lootStats.length; i++){
            for (var j = 0; j<lootStats[i].value; j++){
                lootArray.push(i+1);
            }
        }
        return lootArray;
    }

    $scope.addItem = function(){
        $scope.gameConfig.probabilityLoot.push({value: 0});
    };

    $scope.removeItem = function(){
            $scope.gameConfig.probabilityLoot.pop();
    };

    $scope.addLevel = function(){
        $scope.gameConfig.levels.push({
            XP: 0,
            level: $scope.gameConfig.levels.length,
            upgradePoints: 0
        });
        $scope.counterAdd++;
    };

    $scope.removeLevel = function(){
      if ($scope.counterAdd > 0 ){
          $scope.counterAdd--;
          $scope.gameConfig.levels.pop();
      }
    };

    $scope.updateGameConfig = function (gameConfig)
    {
        $scope.updateError = false;
        $scope.updateSuccess = false;
        var experiencePerLevel = [];
        var upgradePointsPerLevel = [];

        for (var i = 0; i < gameConfig.levels.length; i++){
            experiencePerLevel.push(gameConfig.levels[i].XP);
            upgradePointsPerLevel.push(gameConfig.levels[i].upgradePoints)
        }

        var game= {
            baseExperienceIncreaseOnHit: gameConfig.baseExperienceIncreaseOnHit,
            baseAttackDamage: gameConfig.baseAttackDamage,
            hypeAttackDamage: gameConfig.hypeAttackDamage,
            maximumLevel: gameConfig.levels.length - 1,
            experiencePerLevel: experiencePerLevel,
            upgradePointsPerLevel: upgradePointsPerLevel,
            probabilityLoot: createLootArray(gameConfig.probabilityLoot)
        };
        gameResource.updateGameConfig(game, function onSuccess(data)
        {
            $scope.gameConfig = data;
            $scope.updateSuccess = true;
            extractLevelsAndItems(data);
            extractProbability(data);
            $scope.counterAdd = 0;
        }, function onError(data)
        {
            $scope.updateError = true;
        });
    };

    $scope.validateItems = function(){
        var sum = 0;
        for (var i = 0; i < $scope.gameConfig.probabilityLoot.length; i++){
            console.log("Sum is: "+sum+" and scope is "+ $scope.gameConfig.probabilityLoot[i].value);
            sum+=$scope.gameConfig.probabilityLoot[i].value;
        }
        return sum != 100;
    }

    $scope.init();
});
