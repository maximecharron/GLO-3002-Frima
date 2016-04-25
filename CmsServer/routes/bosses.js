var BossRepository =  require('./../repository/bossRepository.js');
var redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
var redis = require('redis').createClient(redisUrl);
const OK = 200;

exports.getConstantBossList = function(request, response){
    BossRepository.findBaseReferenceBosses(function(list){
        response.status(OK).send(list);
    });
};

exports.getBossList = function(request, response){
    BossRepository.findBosses(function(list){
        response.status(OK).send(list);
    });
};

exports.updateBoss = function(request, response) {
    var boss = {
        bossName: request.body.bossName,
        currentBossLife: request.body.currentBossLife,
        maximumBossLife: request.body.maximumBossLife,
        serverName: request.body.serverName,
        status: request.body.status
    };
    BossRepository.updateBoss(boss, function (updatedBoss) {
        redis.hmset(boss.serverName, boss);
        redis.set(boss.serverName+"CurrentLife", boss.currentBossLife);
        var channel = boss.serverName;
        redis.publish(channel, JSON.stringify(boss));
        response.status(OK).send(updatedBoss);
    });
};