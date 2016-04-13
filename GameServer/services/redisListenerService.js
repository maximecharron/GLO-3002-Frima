var redisSub = require('redis').createClient(process.env.REDIS_URL);
var hostname = process.env.SERVER_NAME || require('os').hostname();

var self;

//Constructor
function RedisListenerService(bossService, bossCommunicationService, lootService)
{
    this.serverNameSubscribeCMS = hostname;
    this.bossService = bossService;
    this.bossCommunicationService = bossCommunicationService;
    this.lootService = lootService;

    this.subscribeServerCmsName(this.serverNameSubscribeCMS);
    redisSub.subscribe("bossDead");
    redisSub.subscribe("itemsUpdate");
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
        var boss = self.bossService.getCurrentBoss();
        console.log(boss);
        self.bossCommunicationService.broadcastBossDead(boss);
        self.bossService.reviveBoss();
    }
    else if (channel == self.serverNameSubscribeCMS)
    {
        try
        {
            var bossMessage = JSON.parse(message);
            self.bossService.updateBoss(bossMessage.currentBossLife, bossMessage.maximumBossLife);
        } catch (error)
        {
            console.log(error);
        }
    }
    else if (channel == "itemsUpdate"){
        self.lootService.initializeItems();
    }
});

module.exports = RedisListenerService;
