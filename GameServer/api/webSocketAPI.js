var ws = require('ws');
var wss = require('ws').Server;

var BossService = require('./../services/bossService.js');
var BossCommunicationService = require('./../services/bossCommunicationService.js');

var bossCommunicationService = new BossCommunicationService();
var bossService = new BossService();

exports.setWebSocketServer = function (webSocketServer)
{
    wss = webSocketServer;
    bossCommunicationService.setWebSocketServer(webSocketServer);
}

exports.newConnection = function (webSocket)
{
    try
    {
        webSocket.send(bossCommunicationService.createBossStatusUpdate(theBoss));
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
}

function newMessage(message, webSocket)
{

    var request = {};
    try
    {
        var request = JSON.parse(message);
        if (request.command.name == "attack")
        {
            if(request.command.parameters.number)
            {
                BossService.makeDamage(request.command.parameters.number);
            }
            else
            {
                console.log("Problem with receiveDamage: ", e, request);
            }
        }

        if (request.command.name == "keepAlive")
        {
            BossCommunicationService.keepAlive(websocket);
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

exports.initializeBoss = function ()
{
    bossService.initializeBoss();
};
