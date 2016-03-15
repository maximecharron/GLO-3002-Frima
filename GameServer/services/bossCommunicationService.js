var ws = require('ws');

//Constructor
function BossCommunicationService(webSocketServer)
{
    this.lastLifeBroadcasted = 0;
    this.wss = webSocketServer;
}

//Public method
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
};

BossCommunicationService.prototype.broadcastBossDead = function(theBoss)
{
    var bossUpdate = this.createBossStatusUpdate(theBoss);
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
};

BossCommunicationService.prototype.broadcastBossInformation = function(theBoss)
{
    if (theBoss)
    {
        if (this.lastLifeBroadcasted != theBoss.getLife() && this.wss.clients && theBoss.getLife() !== 0)
        {
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
};

BossCommunicationService.prototype.keepAlive = function(theBoss, webSocket)
{
    var self = this;
    var response = self.createBossStatusUpdate(theBoss);
    try
    {
        webSocket.send(response);
    } catch (e)
    {
        console.log("Problem with keepAlive :", e);
    }
};

module.exports = BossCommunicationService;
