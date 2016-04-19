var ws = require('ws');

//Constructor
function GameCommunicationService(webSocketServer, gameService)
{
    this.wss = webSocketServer;
    this.gameService = gameService;
}

//Public method
GameCommunicationService.prototype.sendAllGameInfo = function(websocket){
    this.sendGameBaseStatUpdate(websocket);
    this.sendComboUpdate(websocket);
};

GameCommunicationService.prototype.sendGameBaseStatUpdate = function(webSocket)
{
    var gameBaseStatUpdate = this.createGameBaseStatUpdate();

    webSocket.send(gameBaseStatUpdate);
};

GameCommunicationService.prototype.sendComboUpdate = function(webSocket)
{
    var comboUpdate = this.createComboUpdate();

    webSocket.send(comboUpdate);

};

GameCommunicationService.prototype.broadCastGameBaseStatUpdate = function()
{
    var gameBaseStatUpdate = this.createGameBaseStatUpdate();
    this.wss.clients.forEach(function each(client)
    {
        try
        {
            client.send(gameBaseStatUpdate);
        } catch (error)
        {
            console.log("Problem with broadCastGameBaseStatUpdate :", error);
        }
    });
};

GameCommunicationService.prototype.broadCastComboUpdate = function()
{
    var comboUpdate = this.createComboUpdate();
    this.wss.clients.forEach(function each(client)
    {
        try
        {
            client.send(comboUpdate);
        } catch (error)
        {
            console.log("Problem with broadCastComboUpdate :", error);
        }
    });
};

GameCommunicationService.prototype.createGameBaseStatUpdate = function()
{
    var gameBaseStat = this.gameService.getGameBaseStat();

    return  JSON.stringify(
    {
        command:
        {
            name: "gameBaseStatUpdate",
            parameters: gameBaseStat
        }
    });
};

GameCommunicationService.prototype.createComboUpdate = function()
{
    var combos = this.gameService.getCombos();

    return  JSON.stringify(
    {
        command:
        {
            name: "comboUpdate",
            parameters: combos
        }
    });
};

module.exports = GameCommunicationService;

