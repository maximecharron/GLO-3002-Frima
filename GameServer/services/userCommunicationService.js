
//Constructor
function UserCommunicationService(webSocketServer, lootService)
{
    this.lastLifeBroadcasted = 0;
    this.lootService = lootService;
    this.wss = webSocketServer;
}

//Public method
UserCommunicationService.prototype.sendUserStatusUpdate = function(webSocket)
{
    var userStatusUpdate =  JSON.stringify(
    {
        command:
        {
            name: "userStatusUpdate",
            parameters: "stuffHere"
        }
    });

    webSocket.send(userStatusUpdate);

};

module.exports = UserCommunicationService;
