var GameBaseStatRepository =  require('./../repository/gameBaseStatRepository.js');
var redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
var redis = require('redis').createClient(redisUrl);
const OK = 200;

exports.getGameBaseStat = function(request, response){
    GameBaseStatRepository.findGameBaseStat(function(list){
        response.status(OK).send(list);
    });
};

exports.updateGameBaseStat = function(request, response) {
    var gameBaseStat = {
        baseXP : request.body.baseXP,
        baseDamage : request.body.baseDamage,
        ultimateDamage : request.body.ultimateDamage
    };
    GameBaseStatRepository.updateGameBaseStat(gameBaseStat, function (updatedGameBaseStat) {
        var channel = "gameBaseStatUpdate";
        redis.publish(channel, "newBaseStat");
        response.status(OK).send(updatedGameBaseStat);
    });
};