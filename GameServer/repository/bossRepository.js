var DbBoss = require('./../models/boss.js');
var redis = require('./../services/redisService.js').redisSet;
var hostname = process.env.SERVER_NAME || require('os').hostname();

var Boss = require('./../domain/boss.js');
var bossConfig = require('./../config/bossConfig.js');
var RedisCommunicationService = require('./../services/redisCommunicationService.js').RedisCommunicationService;

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
        console.log("redis: {0}", serverName);
        if(object)
        {
            console.log("inside redis: {0}", serverName);
            var boss = new Boss(serverName, object.bossName, object.currentBossLife, object.constantBossLife, object.status)
            callBack(boss);
        }
        else
        {
            DbBoss.findBoss(serverName, function(bossModel)
            {
                console.log("DbBoss: {0}", serverName);
                if(bossModel)
                {
                    console.log("inside dbBoss: {0}", serverName);
                    var boss = new Boss(serverName, bossModel.bossName, bossModel.currentBossLife, bossModel.constantBossLife, bossModel.status);
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
    var boss = new Boss(hostname, bossConfig.bossName, bossConfig.currentLife, bossConfig.constantLife, bossConfig.status );
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
    console.log("saveBossRedis: {0}", hostname);
    RedisCommunicationService.setBoss(hostname, boss);
}

BossRepository.prototype.saveBossBd = function (boss)
{
    DbBoss.backupBoss(boss);
}

module.exports = BossRepository;
