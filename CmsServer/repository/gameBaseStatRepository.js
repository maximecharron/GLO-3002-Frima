var GameBaseStat = require('./../models/gameBaseStat.js').model;


exports.findGameBaseStat = function (callback)
{
    GameBaseStat.findOne({}, function (err, result)
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

exports.updateGameBaseStat = function (gameBaseStatToUpdate, callback)
{
    this.findGameBaseStat(function (gameBaseStat)
    {
        gameBaseStat.baseDamage = gameBaseStatToUpdate.baseDamage;
        gameBaseStat.ultimateDamage = gameBaseStatToUpdate.ultimateDamage;
        gameBaseStat.baseXP = gameBaseStatToUpdate.baseXP;
        gameBaseStat.save(function (err, combo)
        {
            if (err)
            {
                console.log(err);
            }
            callback(combo);
        });
    });
};
