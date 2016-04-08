var ws = require('ws');

var self;
//Constructor
function BossCommunicationService(webSocketServer, lootService, userService)
{
    this.lastLifeBroadcasted = 0;
    this.lootService = lootService;
    this.wss = webSocketServer;
    this.userService = userService;

    self = this;
}

//Public method
BossCommunicationService.prototype.createBossStatusUpdate = function(boss)
{
    return JSON.stringify(
    {
        command:
        {
            name: "bossStatusUpdate",
            parameters: boss.toJson()
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
            var lootItems = self.lootService.createItemCommand(self.lootService.getLoot());
            var clientId = client._ultron.id;
            self.userService.addUserItems(clientId, lootItems);
            client.send(bossUpdate);
            client.send(lootItems);
            client.close();
        } catch (error)
        {
            console.log(error);
        }
    });
};

BossCommunicationService.prototype.broadcastBossInformation = function(boss)
{
    if (boss)
    {
        if (this.lastLifeBroadcasted != boss.getLife() && this.wss.clients && boss.getLife() !== 0)
        {
            this.lastLifeBroadcasted = boss.getLife();
            var bossUpdate = this.createBossStatusUpdate(boss);
            this.wss.clients.forEach(function each(client)
            {
                try
                {
                    client.send(bossUpdate);
                } catch (error)
                {
                    console.log("Problem with broadcastBossInformation :", error);
                }
            });
        }
    }
};

BossCommunicationService.prototype.keepAlive = function(boss, webSocket)
{
    var self = this;
    var response = self.createBossStatusUpdate(boss);
    try
    {
        webSocket.send(response);
    } catch (error)
    {
        console.log("Problem with keepAlive :", error);
    }
};

module.exports = BossCommunicationService;
