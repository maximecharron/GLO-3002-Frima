var redis = require('redis').createClient(process.env.REDIS_URL);

var hostname = process.env.SERVER_NAME || require('os').hostname();

//Constructor
function RedisCommunicationService()
{
    this.currentBossLifeKey = hostname + "CurrentLife";
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

RedisCommunicationService.prototype.findBoss = function (hostname, callback)
{
    redis.hgetall(hostname, function(err, object){
        callback(err, object);
    });
};

RedisCommunicationService.prototype.getBossCurrentLife = function (callback)
{
    redis.get(this.currentBossLifeKey, function(err, object){
        callback(err, object);
    })
};

RedisCommunicationService.prototype.decreaseCurrentLife = function (amount)
{
    redis.decrby(this.currentBossLifeKey, amount);
};

RedisCommunicationService.prototype.setCurrentLife = function (currentLife)
{
    redis.set(this.currentBossLifeKey, currentLife);
};

module.exports = RedisCommunicationService;
