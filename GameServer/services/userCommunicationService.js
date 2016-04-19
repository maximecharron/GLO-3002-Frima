
//Constructor
function UserCommunicationService()
{

}

//Public method
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
