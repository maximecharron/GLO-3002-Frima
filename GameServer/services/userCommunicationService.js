
//Constructor
function UserCommunicationService()
{

}

//Public method
UserCommunicationService.prototype.sendGameStatusUpdate = function(webSocket)
{
    var userStatusUpdate =  JSON.stringify(
    {
        command:
        {
            name: "gameStatusUpdate",
            parameters:
            {
                baseDamage: "10",
                comboList: "1,2,3,4"
            }
        }
    });

    webSocket.send(userStatusUpdate);

};

UserCommunicationService.prototype.sendUserLevelUpInformation = function(webSocket, levelUpInformation)
{
    var userLevelUpUpdate = JSON.stringify({
        command:{
            name: "userLevelUpInformation",
            parameters:{
                pointForNextLevel: levelUpInformation.pointForNextLevel,
                nextLevelXp: levelUpInformation.nextLevelXp
            }
        }
    });

    webSocket.send(userLevelUpUpdate);
};

module.exports = UserCommunicationService;
