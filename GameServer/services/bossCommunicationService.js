var ws = require('ws');
var wss = require('ws').Server;
var BossService = require('./../services/BossService.js').BossService;

function BossCommunicationService()
{
    this.lastLifeBroadcasted = 0;
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

BossCommunicationService.prototype.broadcastBossDead = function()
{
    var bossUpdate = this.createBossStatusUpdate(theBoss);
    wss.clients.forEach(function each(client)
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
    BossService.reviveBoss();
}

BossCommunicationService.prototype.broadcastBossInformation = function()
{
    var theBoss = BossService.getCurrentBoss();
    if (theBoss)
    {
        if (this.lastLifeBroadcasted != theBoss.getLife() && wss.clients)
        {
            console.log("inside broadcast BossLife :", theBoss.getLife())
            this.lastLifeBroadcasted = theBoss.getLife();
            var bossUpdate = this.createBossStatusUpdate(theBoss);
            wss.clients.forEach(function each(client)
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
    var response = this.createBossStatusUpdate(BossService.getCurrentBoss());
    try
    {
        websocket.send(response);
    } catch (e)
    {
        console.log("Problem with keepAlive :", e);
    }
}

BossCommunicationService.prototype.setWebSocketServer = function(webSocketServer)
{
    wss = webSocketServer;
}

module.exports = BossCommunicationService;
