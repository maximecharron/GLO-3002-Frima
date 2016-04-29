var UserModel = require('../models/user.js').model;
var ItemModel = require('../models/item.js').model;
var jwt = require('jwt-simple');

//Constructor
function UserRepository() { }

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
               console.log("Error when addUserItems: ", err);
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
        user.experiencePoints = parameters.experiencePoints;
        user.level = parameters.level;
        user.requiredExperiencePointsForNextLevel = levelUpInformation.nextLevelXp;
        user.upgradePointsOnLevelComplete = levelUpInformation.pointForNextLevel;
        user.attackPowerLevel += parseInt(parameters.attackPowerLevelUpgrade);
        user.staminaPowerLevel += parseInt(parameters.staminaPowerLevelUpgrade);
        user.hypePowerLevel += parseInt(parameters.hypePowerLevelUpgrade);

        user.save(function (err)
        {
            if (err)
            {
                console.log("Error when levelUp user in database: ", err);
            }
        });
    });
};

UserRepository.prototype.updateUserExperience = function(token, experiencePoints)
{
    getUser(token, function(user){
        user.experiencePoints = experiencePoints;

        user.save(function(err){
            if(err){
                console.log("Error when save updateUserExperience: ", err);
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
        else{
            console.log("Error when search for user in database: ", err);
        }
    });
};

module.exports = UserRepository;