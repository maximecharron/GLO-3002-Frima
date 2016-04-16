var UserModel = require('../models/user').model;
var ItemModel = require('../models/item').model;
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
            var added = false;
            user.items.forEach(function each(userItem)
            {
                 if( userItem.type == item.type && userItem.subType == item.subType && userItem.name == item.name )
                 {
                     added = true;
                     userItem.quantity++;
                 }
            });

            if(added == false)
            {
                var newItem = new ItemModel;
                newItem.type = item.type;
                newItem.subType = item.subType;
                newItem.name = item.name;
                newItem.quantity = 1;
                newItem.staminaRegeneration = item.staminaRegeneration;
                newItem.hypeGeneration = item.hypeGeneration;
                newItem.effectDuration = item.effectDuration;
                user.items.push(newItem);
            }

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
                if( userItem.type == item.type && userItem.subType == item.subType && userItem.name == item.name )
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

UserRepository.prototype.levelUpUser = function(token, parameters, levelUpInformation)
{
    getUser(token, function(user){
        user.currentXP = parameters.currentXP;
        user.level = parameters.currentLevel;
        user.XPNextLevel = levelUpInformation.nextLevelXp;
        user.pointNextLevel = levelUpInformation.pointForNextLevel;
        user.attack += parseInt(parameters.attack);
        user.stamina += parseInt(parameters.stamina);
        user.hype += parseInt(parameters.hype);

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
};

module.exports = UserRepository;