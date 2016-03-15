var redisPub = require('./redisConnectionService.js').redisPub;
var redisSet = require('./redisConnectionService.js').redisSet;
var hostname = process.env.SERVER_NAME || require('os').hostname();

//Constructor
function RedisCommunicationService()
{
    this.serverNameSubscribeCMS = hostname;
}

//Public method
RedisCommunicationService.prototype.setBoss = function (boss)
{
    redisSet.hmset(hostname, boss.toJson());
};

RedisCommunicationService.prototype.setBossCurrentLife = function (currentBossLife)
{
    redisSet.hmset(hostname, {'currentBossLife': currentBossLife});
};

RedisCommunicationService.prototype.publishBossDead = function (bossString)
{
    redisPub.publish("bossDead", bossString);
};

RedisCommunicationService.prototype.findBoss = function (hostname, callback) //We want to pass hostname here
{
    redisSet.hgetall(hostname, function(err, object){
        callback(err, object);
    });
};

module.exports = RedisCommunicationService;
