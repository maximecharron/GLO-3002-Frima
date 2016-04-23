var ComboRepository =  require('./../repository/comboRepository.js');
var redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
var redis = require('redis').createClient(redisUrl);
const OK = 200;

exports.getCombos = function(request, response){
    ComboRepository.findAllCombos(function(list){
        response.status(OK).send(list);
    });
};

exports.deleteCombo= function(request, response){
    ComboRepository.removeCombo(request.body.name, function(success){
        if (success){
            response.status(OK).send();
        } else {
            response.status(404).send();
        }
    });
};

exports.updateCombo = function(request, response) {
    var combo = {
        name : request.body.name,
        triggerFrequency : request.body.triggerFrequency,
        bonusMultiplier : request.body.bonusMultiplier,
        triggerZone : request.body.triggerZone,
        maxFirstHitWaitTime: request.body.maxFirstHitWaitTime,
        maxWaitTimeBetweenHits: request.body.maxWaitTimeBetweenHits,
        hitZones: request.body.hitZones
    };
    ComboRepository.updateCombo(combo, function (updatedCombo) {
        var channel = "comboUpdate";
        redis.publish(channel, "newCombo");
        response.status(OK).send(updatedCombo);
    });
};

exports.newCombo = function(request, response) {
    var combo = {
        name : request.body.name,
        triggerFrequency : request.body.triggerFrequency,
        bonusMultiplier : request.body.bonusMultiplier,
        triggerZone : request.body.triggerZone,
        maxFirstHitWaitTime: request.body.maxFirstHitWaitTime,
        maxWaitTimeBetweenHits: request.body.maxWaitTimeBetweenHits,
        hitZones: request.body.hitZones
    };
    ComboRepository.newCombo(combo, function (createdCombo) {
        var channel = "comboUpdate";
        redis.publish(channel, "newCombo");
        response.status(OK).send(createdCombo);
    });
};