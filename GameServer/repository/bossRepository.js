var DbBoss = require('./../models/boss.js');
var redis = require('redis').createClient(process.env.REDIS_URL);
var hostname = require('os').hostname();

var Boss = require('./../domain/boss.js');
var bossConfig = require('./../config/bossConfig.js');

function BossRepository()
{}

BossRepository.prototype.getBoss = function(callBack, constant)
{
    var self = this;
    var serverName = hostname;
    if(constant)
    {
        serverName += "Constant";
    }

    redis.hgetall(serverName, function(err, object)
    {
        if(object)
        {
            var boss = new Boss(object.bossName, object.currentBossLife, object.constantBossLife, object.status)
            callBack(boss);
        }
        else
        {
            DbBoss.findBoss(serverName, function(boss)
            {
                if(boss)
                {
                    callBack(boss);
                }
                else
                {
                    if(constant)
                    {
                        getConfigBoss(function(boss)
                        {
                            callBack(boss);
                        });
                    }
                    else
                    {
                        self.getBoss(callBack, true);
                    }
                }
            });
        }
    })
}

BossRepository.prototype.getNewBoss = function(){}

function getConfigBoss(callBack)
{
    var boss = new Boss(bossConfig.bossName, bossConfig.currentLife, bossConfig.constantLife, bossConfig.status );
    callBack(boss);
}

BossRepository.prototype.saveBoth = function(boss)
{
    var self = this;
    saveBossRedis(boss);
    self.saveBossBd(boss);
}

function saveBossRedis(boss)
{
    redis.hmset(hostname, boss.toJson());
}

BossRepository.prototype.saveBossBd = function (boss)
{
    DbBoss.backupBoss(boss);
}

module.exports = BossRepository;
