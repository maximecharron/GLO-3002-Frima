var BossRepository =  require('./../repository/bossRepository.js')
var redisUrl = process.env.REDIS_URL || 'redis://localhost:7069';
var redis = require('redis').createClient(redisUrl);

exports.getConstantBossList = function(req, res){
    BossRepository.findConstantBossList(function(list){
        res.status(200).send(list);
    })
};

exports.getBossList = function(req, res){
    BossRepository.findBossList(function(list){
        res.status(200).send(list);
    })
};

exports.updateBoss = function(req, res) {
    var boss = {
        bossName: req.body.bossName,
        currentBossLife: req.body.currentBossLife,
        constantBossLife: req.body.constantBossLife,
        serverName: req.body.serverName,
        status: req.body.status
    }
    BossRepository.updateBoss(boss, function (updatedBoss) {
        redis.hmset(boss.serverName, boss);
        redis.publish(boss.serverName, boss);
        res.status(200).send(updatedBoss);
    })
};