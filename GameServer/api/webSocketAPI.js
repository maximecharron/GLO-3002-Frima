var self;
//Constructor
function WebSocketAPI(bossService, bossCommunicationService, redisCommunicationService, webSocketServer, userService, userCommunicationService, gameCommunicationService)
{
    this.bossService = bossService;
    this.wss = webSocketServer;
    this.bossCommunicationService = bossCommunicationService;
    this.redisCommunicationService = redisCommunicationService;
    this.userService = userService;
    this.userCommunicationService = userCommunicationService;
    this.gameCommunicationService = gameCommunicationService;

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
    var webSocketClientId = webSocket._ultron.id;
    var request = {};
    try
    {
        request = JSON.parse(message);
        if (request.command.name == "attack")
        {
            if (request.command.parameters.value)
            {
                self.bossService.makeDamage(request.command.parameters.value, function (boss)
                {
                    if (boss.getLife() <= 0)
                    {
                        self.redisCommunicationService.publishBossDead(boss.toString());
                    }
                });
            }
            else
            {
                console.log("Problem with attack, value can't be null: ", e, request);
            }
        }

        else if (request.command.name == "keepAlive")
        {
            var boss = self.bossService.getCurrentBoss();
            self.bossCommunicationService.keepAlive(boss, webSocket);
        }

        else if(request.command.name == "registerClient")
        {
            if(request.command.parameters.token){
                var token = request.command.parameters.token;

                self.userService.addUserWebSocket(webSocketClientId, token);
                self.gameCommunicationService.sendAllGameInfo(webSocket);
            }
            else{
                console.log("Problem with registerClient, token can't be null: ", e, request);
            }
        }

        else if(request.command.name == "useItems")
        {
            if(request.command.parameters.items){
                var items = request.command.parameters.items;
                self.userService.updateUserItems(webSocketClientId, items);
            }
            else{
                console.log("Problem with useItems, items can't be null: ", e, request);
            }
        }

        else if(request.command.name == "updateUserLevel")
        {
            if(request.command.parameters.level){
                var informationNextLevel = self.userService.getInformationNextLevel(request.command.parameters.level);
                self.userService.levelUpUser( webSocketClientId, request.command.parameters, informationNextLevel);
                self.userCommunicationService.sendUserLevelUpInformation(webSocket, informationNextLevel);
            }
            else{
                console.log("Problem with updateUserLevel, level can't be null: ", e, request);
            }
        }

        else if(request.command.name == "updateUserExperience")
        {
            if(request.command.parameters.experiencePoints){
                self.userService.updateUserExperience(webSocketClientId, request.command.parameters.experiencePoints);
            }
            else{
                console.log("Problem with updateUserExperience, experiencePoints can't be null: ", e, request);
            }
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