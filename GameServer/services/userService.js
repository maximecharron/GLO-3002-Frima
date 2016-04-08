
//Constructor
function UserService(userRepository)
{
    this.userWebSockets = {};
    this.userRepository = userRepository;
}

//Public method
UserService.prototype.addUserWebSocket = function(webSocketId, token)
{
    this.userWebSockets[webSocketId] = token;
}

UserService.prototype.addUserItems = function(webSocketId, items)
{
    var token = this.userWebSockets[webSocketId];
    this.userRepository.addUserItems(token, items);
}

UserService.prototype.updateUserItems = function(webSocketId, items)
{
    var token = this.userWebSockets[webSocketId];
    this.userRepository.updateUserItems(token, items);
}


//Private method

module.exports = UserService;