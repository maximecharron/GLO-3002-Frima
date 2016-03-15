var redisSub = require('./redisConnectionService.js').redisSub;
var hostname = process.env.SERVER_NAME || require('os').hostname();

var self;

//Constructor
function RedisListenerService(bossService, bossCommunicationService)
{
    this.serverNameSubscribeCMS = hostname;
    this.bossService = bossService;
    this.bossCommunicationService = bossCommunicationService;
    this.subscribeServerCmsName(this.serverNameSubscribeCMS);
    redisSub.subscribe("bossDead");
    self = this;
}

//Public method
RedisListenerService.prototype.subscribeServerCmsName = function (serverName)
{
    this.serverNameSubscribeCMS = serverName;
    redisSub.subscribe(serverName);
};

//Private method
redisSub.on('message', function (channel, message)
{
    if (channel == "bossDead")
    {
        //console.log("BroadCast bossDead: ", channel);
        self.bossCommunicationService.broadcastBossDead(self.bossService);
        self.bossService.reviveBoss();
    } else if (channel == self.serverNameSubscribeCMS)
    {
        var bossMessage;
        try
        {
            bossMessage = JSON.parse(message);
            self.bossService.updateBoss(bossMessage.currentBossLife, bossMessage.maximumBossLife);
        } catch (e)
        {
            console.log(e);
        }
    }
});

module.exports = RedisListenerService;
