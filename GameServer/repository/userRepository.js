var UserModel = require('../models/user').model;
var jwt = require('jwt-simple');


//Constructor
function UserRepository()
{

}

//Public method
UserRepository.prototype.updateUserItems = function(token, items)
{
    getUser(token, function()
    {
        user.items = items;
        user.save(function (err)
        {
            if (err)
            {
               console.log("Error when updateItems: ", err);
            }
        });
    });
};

//Private method
var getUser = function(token, callback)
{
    var decoded = jwt.decode(token, 'FRIMA_TOKEN_SECRET');

    UserModel.findOne({ '_id': decoded.iss }, function (err, user) {
        if (!err)
        {
            if (user)
            {
                callback(user);
            } else
            {
                callback(user);
            }
        }
    });
}

module.exports = UserRepository;