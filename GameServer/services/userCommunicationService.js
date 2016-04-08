
//Constructor
function UserCommunicationService()
{

}

//Public method
UserCommunicationService.prototype.sendUserStatusUpdate = function(webSocket)
{
    var userStatusUpdate =  JSON.stringify(
    {
        command:
        {
            name: "userStatusUpdate",
            parameters:
            {
                baseDamage: "10",
                comboList: "1,2,3,4"
            }
        }
    });

    webSocket.send(userStatusUpdate);

};

module.exports = UserCommunicationService;
