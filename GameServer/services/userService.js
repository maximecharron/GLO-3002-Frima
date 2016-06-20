
//Constructor
function UserService(userRepository, userCommunicationService)
{
    this.userWebSockets = {};
    this.userRepository = userRepository;
    this.userCommunicationService = userCommunicationService;
    this.experiencePerLevel = [];
    this.upgradePointsPerLevel = [];
    this.maximumLevel = 0;
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

UserService.prototype.levelUpUser = function(webSocketId, parameters, levelUpInformation)
{
    var token = this.userWebSockets[webSocketId];
    this.userRepository.levelUpUser(token, parameters, levelUpInformation);
};

UserService.prototype.updateUserExperience = function(webSocketId, experiencePoints)
{
    var token = this.userWebSockets[webSocketId];
    this.userRepository.updateUserExperience(token, experiencePoints);
};

UserService.prototype.getInformationNextLevel = function(nextLevel)
{
    var levelPoint = { nextLevelXp: this.experiencePerLevel[nextLevel], pointForNextLevel: this.upgradePointsPerLevel[nextLevel] };
    return levelPoint;
};

UserService.prototype.setExperienceInformation = function(experiencePerLevel, upgradePointsPerLevel, maximumLevel) {
    this.experiencePerLevel = experiencePerLevel;
    this.upgradePointsPerLevel = upgradePointsPerLevel;
    this.maximumLevel = maximumLevel;
};


//Private method
module.exports = UserService;