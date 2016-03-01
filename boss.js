var redis = require('redis').createClient(process.env.REDIS_URL);
var STATUS = Object.freeze({ALIVE: "ALIVE", DEAD: "DEAD"})

//Constructor
function Boss(name)
{
    //Private
    var currentBossLife;
    var constantBossLife;
    var status;
    var bossName = name;

    //Private method
    function getBossInfo(callBack)
    {
        //console.log("Boss: BossName :", bossName);
        redis.hgetall(bossName, function(err, object)
        {
            if(!err)
            {
                //console.log("Stuff from redis: ", object);
                currentBossLife = object.currentBossLife;
                constantBossLife = object.constantBossLife;
                status = object.status;
                //console.log("The boss :",bossName, currentBossLife, constantBossLife, status);
                callBack();
            }
            else
            {
                console.log("Impossible to get boss information", err)
            }
        })
    }

    //Public method
    Boss.prototype.initialize = function(callBack)
    {
        getBossInfo(callBack);

    }

    Boss.prototype.toJson = function()
    {
        var bossJson =
        {
            bossName: bossName,
            currentBossLife: currentBossLife,
            constantBossLife: constantBossLife,
            status: status
        }

        return bossJson;
    }

    Boss.prototype.toString = function()
    {
        console.log(JSON.stringify(
            {
                "bossName" : bossName,
                "constantBossLife": constantBossLife,
                "currentBossLife": currentBossLife,
                "status": status
            }));
        return JSON.stringify(
            {
                "bossName" : bossName,
                "constantBossLife": constantBossLife,
                "currentBossLife": currentBossLife,
                "status": status
            });
    }

    Boss.prototype.receiveDamage = function(amountDamage)
    {
        if (currentBossLife >0)
        {
            currentBossLife = currentBossLife - amountDamage;
        }
        if(currentBossLife <= 0)
        {
            status = STATUS.DEAD;
            redis.publish(bossName, this.toString());
        }
        redis.hmset(bossName, {'currentBossLife': currentBossLife});
        redis.publish(bossName, this.toString());
    }

    Boss.prototype.getLife = function()
    {
        return currentBossLife;
    }

    Boss.prototype.getStatus = function()
    {
        return status;
    }

    Boss.prototype.getName = function()
    {
        return bossName;
    }

}

exports.Boss = Boss;
