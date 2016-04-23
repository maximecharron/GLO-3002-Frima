var GameConfig = require('./../models/gameConfig.js').model;


exports.findGameConfig = function (callback)
{
    GameConfig.findOne({}, function (err, result)
    {
        if (result)
        {
            callback(result);
        } else
        {
            callback(null);
        }
    });
};

exports.updateGameConfig = function (gameConfigToUpdate, callback)
{
    this.findGameConfig(function (gameConfig)
    {
        gameConfig.baseAttackDamage = gameConfigToUpdate.baseAttackDamage;
        gameConfig.hypeAttackDamage = gameConfigToUpdate.hypeAttackDamage;
        gameConfig.baseExperienceIncreaseOnHit = gameConfigToUpdate.baseExperienceIncreaseOnHit;
        gameConfig.maximumLevel  = gameConfigToUpdate.maximumLevel;
        gameConfig.experiencePerLevel = gameConfigToUpdate.experiencePerLevel;
        gameConfig.upgradePointsPerLevel = gameConfigToUpdate.upgradePointsPerLevel;
        gameConfig.probabilityLoot  = gameConfigToUpdate.probabilityLoot;
        gameConfig.save(function (err, combo)
        {
            if (err)
            {
                console.log(err);
            }
            callback(combo);
        });
    });
};
