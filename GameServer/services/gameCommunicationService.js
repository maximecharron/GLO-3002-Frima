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
    var gameBaseStat = this.gameService.getGameBaseStat();

    var gameBaseStatUpdate =  JSON.stringify(
        {
            command:
            {
                name: "gameBaseStatUpdate",
                parameters: gameBaseStat
            }
        });

    webSocket.send(gameBaseStatUpdate);

};

GameCommunicationService.prototype.sendComboUpdate = function(webSocket)
{
    var combos = this.gameService.getCombos();

    var comboUpdate =  JSON.stringify(
        {
            command:
            {
                name: "comboUpdate",
                parameters: combos
            }
        });

    webSocket.send(comboUpdate);

};

module.exports = GameCommunicationService;

