var redisPub = require('redis').createClient(process.env.REDIS_URL);
var redisSub = require('redis').createClient(process.env.REDIS_URL);
var redisSet = require('redis').createClient(process.env.REDIS_URL);

var hostname = process.env.SERVER_NAME || require('os').hostname();

var BossCommunicationService = require('./../services/bossCommunicationService.js').BossCommunicationService;
var BossService = require('./../services/BossService.js').BossService;

function RedisCommunicationService()
{
    this.serverNameSubscribeCMS;
}

redisSub.on('message', function (channel, message)
{
    console.log("Redis message: ", channel);
    if (channel == "bossDead")
    {
        console.log("BroadCast bossDead: ", channel);
        BossCommunicationService.broadcastBossDead();
        BossService.reviveBoss();
    } else if (channel == this.serverNameSubscribeCMS)
    {
        var bossMessage;
        console.log("Message is: ", message);
        try
        {
            bossMessage = JSON.parse(message);
            BossService.updateBoss(bossMessage.currentBossLife, bossMessage.constantBossLife);
        } catch (e)
        {
            console.log(e);
        }
    }
})

RedisCommunicationService.prototype.subscribeServerCmsName = function(serverName)
{
    this.serverNameSubscribeCMS = serverName;
    redisSub.subscribe(serverName);
}

RedisCommunicationService.prototype.setBoss = function(hostname, boss)
{
    redisSet.hmset(hostname, boss.toJson());
}

RedisCommunicationService.prototype.setBossCurrentLife = function(currentBossLife)
{
    hmset(hostName, {'currentBossLife': currentBossLife});
}

RedisCommunicationService.prototype.publishBossDead = function(bossString)
{
    redisPub.publish("bossDead", bossString);
}

module.exports = RedisCommunicationService;
