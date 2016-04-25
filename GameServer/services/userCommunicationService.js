
//Constructor
function UserCommunicationService() { }

//Public method
UserCommunicationService.prototype.sendUserLevelUpInformation = function(webSocket, levelUpInformation)
{
    var userLevelUpUpdate = JSON.stringify({
        command:{
            name: "userLevelUpInformation",
            parameters:{
                upgradePointsOnLevelComplete: levelUpInformation.pointForNextLevel,
                requiredExperiencePointsForNextLevel: levelUpInformation.nextLevelXp
            }
        }
    });

    //Log for debug
    console.log("userLevelUpUpdate: ", userLevelUpUpdate);
    //Log for debug

    webSocket.send(userLevelUpUpdate);
};

module.exports = UserCommunicationService;
