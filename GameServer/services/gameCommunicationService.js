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
    var gameBaseStatUpdate = this.createUserGameConfigUpdate();

    webSocket.send(gameBaseStatUpdate);
};

GameCommunicationService.prototype.sendComboUpdate = function(webSocket)
{
    var comboUpdate = this.createComboUpdate();

    webSocket.send(comboUpdate);

};

GameCommunicationService.prototype.broadCastGameConfigUpdate = function()
{
    var userGameConfigUpdate = this.createUserGameConfigUpdate();
    this.wss.clients.forEach(function each(client)
    {
        try
        {
            console.log("Inside send gameCommunicationService: ", userGameConfigUpdate);
            client.send(userGameConfigUpdate);
        } catch (error)
        {
            console.log("Problem with broadCastGameConfigUpdate :", error);
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

            //Log for debug
            console.log("comboUpdate: ", comboUpdate);
            //Log for debug

            client.send(comboUpdate);
        } catch (error)
        {
            console.log("Problem with broadCastComboUpdate :", error);
        }
    });
};

GameCommunicationService.prototype.createUserGameConfigUpdate = function()
{
    var gameConfigUpdate = this.gameService.getUserGameConfig();

    return  JSON.stringify(
    {
        command:
        {
            name: "gameConfigUpdate",
            parameters: gameConfigUpdate
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
            name: "comboHitSequenceUpdate",
            parameters:
            {
                comboHitSequences: combos
            }
        }
    });
};

module.exports = GameCommunicationService;

