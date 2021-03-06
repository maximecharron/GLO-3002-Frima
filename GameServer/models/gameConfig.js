var mongoose = require('mongoose');
var modelHelpers = require('./modelHelpers.js');

var gameConfigSchema = new mongoose.Schema({
    baseAttackDamage : Number,
    baseExperienceIncreaseOnHit : Number,
    hypeAttackDamage : Number,
    maximumLevel : Number,
    experiencePerLevel : [Number],
    upgradePointsPerLevel : [Number],
    probabilityLoot : [Number]
}, {strict: false});

gameConfigSchema.method('toJSON', modelHelpers.toJSON);

var GameConfig = mongoose.model('GameConfig', gameConfigSchema);

exports.schema = gameConfigSchema;
exports.model = GameConfig;
exports.findGameConfig = function(callback){
    GameConfig.findOne( function(err, gameConfig){
        if(gameConfig)
        {
            callback(gameConfig);
        }
        else if(err){
            console.log("Problem to fetch gameConfig in mongo: ", err);
        }
        else{
            callback(null);
        }
    })
};
