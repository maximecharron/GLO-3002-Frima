var ws = require('ws');

function BossCommunicationService(webSocketServer)
{
    this.lastLifeBroadcasted = 0;
    this.wss = webSocketServer;
}

BossCommunicationService.prototype.createBossStatusUpdate = function(theBoss)
{
    return JSON.stringify(
    {
        command:
        {
            name: "bossStatusUpdate",
            parameters: theBoss.toJson()
        }
    });
}

BossCommunicationService.prototype.broadcastBossDead = function(bossService)
{
    var bossUpdate = this.createBossStatusUpdate(bossService.getCurrentBoss());
    this.wss.clients.forEach(function each(client)
    {
        try
        {
            client.send(bossUpdate);
            client.close();
        } catch (e)
        {
            console.log(e);
        }
    });
    bossService.reviveBoss();
}

BossCommunicationService.prototype.broadcastBossInformation = function(theBoss)
{
    if (theBoss)
    {
        if (this.lastLifeBroadcasted != theBoss.getLife() && this.wss.clients)
        {
            console.log("inside broadcast BossLife :", theBoss.getLife());
            this.lastLifeBroadcasted = theBoss.getLife();
            var bossUpdate = this.createBossStatusUpdate(theBoss);
            this.wss.clients.forEach(function each(client)
            {
                try
                {
                    client.send(bossUpdate);
                } catch (e)
                {
                    console.log("Problem with broadcastBossInformation :", e);
                }
            });
        }
    }
}

BossCommunicationService.prototype.keepAlive = function(webSocket)
{
    var self = this;
    var response = self.createBossStatusUpdate(this.bossService.getCurrentBoss());
    try
    {
        webSocket.send(response);
    } catch (e)
    {
        console.log("Problem with keepAlive :", e);
    }
};

module.exports = BossCommunicationService;
