var async = require('async');
var redisValuesHandler = require('redis').createClient(process.env.REDIS_URL);

var bossLife;
exports.getLife = function(callBack)
{
    async.waterfall([
        function(currentBossLifeCallBack){getCurrentBossLife(currentBossLifeCallBack)},
        function(constantBossLifeCallBack){getConstantBossLife(constantBossLifeCallBack)}
    ], function(error, result)
    {
        callBack(bossLife);
    });
}

function getCurrentBossLife (currentBossLifeCallBack)
{
    redisValuesHandler.get('currentBossLife',function(error, result)
    {
        if(error)
        {
            console.log("Error getting currentBossLife: ", error);
        }
        if(!result)
        {
            console.log("currentBossLife is null or empty.");
            currentBossLifeCallBack(null);
        }
        else
        {
            bossLife = result;
            console.log("currentBossLife: ", bossLife)
            currentBossLifeCallBack(null);
        }
    });
}

function getConstantBossLife(constantBossLifeCallBack)
{
    if(!bossLife)
    {
        redisValuesHandler.get('constantBossLife',function(error, result)
        {
            if(error)
            {
                console.log("Error getting constantBossLife: ", error);
            }
            if(!result)
            {
                console.log("constantBossLife is null or empty.");
                bossLife = 100000000000; //TODO: A modifier car ne devrais pas harcoder de valeur. Devrais aller rechercher en BD Mongo les valeurs de la partie.
                constantBossLifeCallBack(null);
            }
            else
            {
                bossLife = result;
                console.log("constantBossLife: ", bossLife)
                constantBossLifeCallBack(null);
            }
        })
    }
    else
    {
        constantBossLifeCallBack(null);
    }
}
