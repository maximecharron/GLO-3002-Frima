var UserModel = require('../models/user').model;
var jwt = require('jwt-simple');

//Constructor
function UserRepository()
{

}

//Public method
UserRepository.prototype.addUserItems = function(token, items)
{
    getUser(token, function(user)
    {
          items.forEach(function each(item)
          {
             user.items.forEach(function each(userItem)
             {
                 if(userItem.name == item.name)
                 {
                     userItem.quantity++;
                 }
             })
          });

        user.save(function (err)
        {
            if (err)
            {
               console.log("Error when updateItems: ", err);
            }
        });
    });
};

UserRepository.prototype.updateUserItems = function(token, items)
{
    getUser(token, function(user)
    {
        items.forEach(function each(item)
        {
            user.items.forEach(function each(userItem)
            {
                if(userItem.name == item.name)
                {
                    userItem.quantity -= item.quantity;
                }
            })
        });

        user.save(function (err)
        {
            if (err)
            {
                console.log("Error when updateItems: ", err);
            }
        });
    });
};

UserRepository.prototype.levelUpUser = function(token, parameters, xpNextLevel)
{
    getUser(token, function(user){
        user.currentXP = parameters.currentXP;
        user.currentLevel = parameters.currentLevel;
        user.XPNextLevel = xpNextLevel;
        user.stamina += parameters.stamina;
        user.hype += parameters.hype;

        user.save(function (err)
        {
            if (err)
            {
                console.log("Error when levelUp user in database: ", err);
            }
        });
    })
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