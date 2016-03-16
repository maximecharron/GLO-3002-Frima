var redis = require('redis').createClient(process.env.REDIS_URL);

var hostname = process.env.SERVER_NAME || require('os').hostname();

//Constructor
function RedisCommunicationService()
{
    this.serverNameSubscribeCMS = hostname;
}

//Public method
RedisCommunicationService.prototype.setBoss = function (boss)
{
    redis.hmset(hostname, boss.toJson());
};

RedisCommunicationService.prototype.setBossCurrentLife = function (currentBossLife)
{
    redis.hmset(hostname, {'currentBossLife': currentBossLife});
};

RedisCommunicationService.prototype.publishBossDead = function (bossString)
{
    redis.publish("bossDead", bossString);
};

RedisCommunicationService.prototype.findBoss = function (hostname, callback) //We want to pass hostname here
{
    redis.hgetall(hostname, function(err, object){
        callback(err, object);
    });
};

module.exports = RedisCommunicationService;
