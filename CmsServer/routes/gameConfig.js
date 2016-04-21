var GameConfigRepository =  require('./../repository/gameConfigRepository.js');
var redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
var redis = require('redis').createClient(redisUrl);
const OK = 200;

exports.getGameConfig = function(request, response){
    GameConfigRepository.findGameConfig(function(list){
        response.status(OK).send(list);
    });
};

exports.updateGameConfig = function(request, response) {
    var gameBaseStat = {
        baseExperienceIncreaseOnHit : request.body.baseExperienceIncreaseOnHit,
        baseAttackDamage : request.body.baseAttackDamage,
        hypeAttackDamage : request.body.hypeAttackDamage
    };
    GameConfigRepository.updateGameConfig(gameConfig, function (updatedGameConfig) {
        var channel = "gameConfigUpdate";
        redis.publish(channel, "newGameConfig");
        response.status(OK).send(updatedGameConfig);
    });
};