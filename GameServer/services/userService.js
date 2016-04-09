
//Constructor
function UserService(userRepository, userCommunicationService)
{
    this.userWebSockets = {};
    this.userRepository = userRepository;
    this.userCommunicationService = userCommunicationService;
    this.levelXPTree = [0, 1000,2000,4000,8000,16000,32000,64000,128000,2560000,512000,1024000,2048000];
    this.pointByLevel = [0,1,1,1,1,1,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3];
}

//Public method
UserService.prototype.addUserWebSocket = function(webSocketId, token)
{
    this.userWebSockets[webSocketId] = token;
};

UserService.prototype.addUserItems = function(webSocketId, items)
{
    var token = this.userWebSockets[webSocketId];
    this.userRepository.addUserItems(token, items);
};

UserService.prototype.updateUserItems = function(webSocketId, items)
{
    var token = this.userWebSockets[webSocketId];
    this.userRepository.updateUserItems(token, items);
};

UserService.prototype.levelUpUser = function(webSocketId, parameters)
{
    var token = this.userWebSockets[webSocketId];
    this.userRepository.levelUpUser(token, parameters, this.levelXPTree[parameters.nextLevel]);
};

UserService.prototype.getInformationNextLevel = function(nextLevel)
{
    var levelPoint = { nextLevelXp: this.levelXPTree[nextLevel], pointForNextLevel: this.pointByLevel[nextLevel] };
    return levelPoint;
}


//Private method

module.exports = UserService;