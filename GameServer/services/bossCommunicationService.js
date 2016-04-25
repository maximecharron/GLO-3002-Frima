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
            var items = self.lootService.getLoot();
            var lootItems = self.lootService.createItemsCommand(items);

            var clientId = client._ultron.id;

            try
            {
                self.userService.addUserItems(clientId, items);
            }
            catch (error)
            {
                console.log("Impossible to add item to the user: ", error);
            }

            //Log for debug
            console.log("bossUpdate: ", bossUpdate);
            console.log("lootItems: ", lootItems);
            //Log for debug

            client.send(bossUpdate);
            client.send(lootItems);
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
