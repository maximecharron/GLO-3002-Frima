var redisSub = require('./redisConnectionService.js').redisSub;
var hostname = process.env.SERVER_NAME || require('os').hostname();

function RedisListenerService(bossService, bossCommunicationService)
{
    this.serverNameSubscribeCMS =hostname+"CMS";
    this.bossService = bossService
    this.bossCommunicationService = bossCommunicationService;
    this.subscribeServerCmsName(this.serverNameSubscribeCMS);
    redisSub.subscribe("bossDead");
}

redisSub.on('message', function (channel, message)
{
    console.log("Redis message: ", channel);
    if (channel == "bossDead")
    {
        console.log("BroadCast bossDead: ", channel);
        this.bossCommunicationService.broadcastBossDead();
        this.bossService.reviveBoss();
    } else if (channel == this.serverNameSubscribeCMS)
    {
        var bossMessage;
        console.log("Message is: ", message);
        try
        {
            bossMessage = JSON.parse(message);
            this.bossService.updateBoss(bossMessage.currentBossLife, bossMessage.constantBossLife);
        } catch (e)
        {
            console.log(e);
        }
    }
});

RedisListenerService.prototype.subscribeServerCmsName = function (serverName)
{
    this.serverNameSubscribeCMS = serverName;
    redisSub.subscribe(serverName);
};

module.exports = RedisListenerService;


