function WebSocketAPI(bossService, bossCommunicationService, redisCommunicationService, webSocketServer)
{
    this.bossService = bossService;
    this.wss = webSocketServer;
    this.bossCommunicationService = bossCommunicationService;
    this.redisCommunicationService = redisCommunicationService;
}

WebSocketAPI.prototype.newConnection = function (webSocket)
{
    var theBoss = this.bossService.getCurrentBoss();
    try
    {
        webSocket.send(this.bossCommunicationService.createBossStatusUpdate());
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

function newMessage(message, webSocket)
{

    var request = {};
    try
    {
        var request = JSON.parse(message);
        if (request.command.name == "attack")
        {
            if (request.command.parameters.number)
            {
                this.bossService.makeDamage(request.command.parameters.number, function (boss)
                {
                    if (boss.getLife > 0)
                    {
                        this.redisCommunicationService.setBossCurrentLife(boss.getLife());
                    } else
                    {
                        this.redisCommunicationService.publishBossDead();
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
            this.bossCommunicationService.keepAlive(webSocket);
        }
    } catch (e)
    {
        return console.log("Problem to parse :", e);
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

WebSocketAPI.prototype.initializeBoss = function ()
{
    this.bossService.initializeBoss();
};

module.exports = WebSocketAPI;
