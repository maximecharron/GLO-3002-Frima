var self;
//Constructor
function WebSocketAPI(bossService, bossCommunicationService, redisCommunicationService, webSocketServer, userService)
{
    this.bossService = bossService;
    this.wss = webSocketServer;
    this.bossCommunicationService = bossCommunicationService;
    this.redisCommunicationService = redisCommunicationService;
    this.userService = userService;
    self = this;
}

//Public method
WebSocketAPI.prototype.newConnection = function (webSocket)
{
    var boss = self.bossService.getCurrentBoss();
    try
    {
        webSocket.send(self.bossCommunicationService.createBossStatusUpdate(boss));
    } catch (e)
    {
        console.log(e);
    }
    webSocket.on("message", function (message)
    {
        newMessage(message, webSocket);
    });

    webSocket.on("close", function ()
    {
        close(webSocket);
    });
};

WebSocketAPI.prototype.initializeBoss = function ()
{
    self.bossService.initializeBoss();
};

//Private method
function newMessage(message, webSocket)
{

    var request = {};
    try
    {
        request = JSON.parse(message);
        if (request.command.name == "attack")
        {
            if (request.command.parameters.number)
            {
                self.bossService.makeDamage(request.command.parameters.number, function (boss)
                {
                    if (boss.getLife() > 0)
                    {
                        self.redisCommunicationService.setBossCurrentLife(boss.getLife());
                    } else
                    {
                        self.redisCommunicationService.publishBossDead(boss.toString());
                    }
                });
            }
            else
            {
                console.log("Problem with receiveDamage: ", e, request);
            }
        }

        if (request.command.name == "keepAlive")
        {
            var boss = self.bossService.getCurrentBoss();
            self.bossCommunicationService.keepAlive(boss, webSocket);
        }
    } catch (error)
    {
        return console.log("Problem to parse :", error);
    }


}

function close(webSocket)
{
    try
    {
        webSocket.close();
    } catch (e)
    {
        console.log(e);
    }

}

module.exports = WebSocketAPI;
