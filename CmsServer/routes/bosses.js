var BossRepository =  require('./../repository/bossRepository.js');
var redisUrl = 'redis://h:p88tk5goahehq8c9hta4ugr533t@ec2-54-227-252-28.compute-1.amazonaws.com:7069' || 'redis://localhost:6379';
var redis = require('redis').createClient(redisUrl);

exports.getConstantBossList = function(req, res){
    BossRepository.findConstantBossList(function(list){
        res.status(200).send(list);
    });
};

exports.getBossList = function(req, res){
    BossRepository.findBossList(function(list){
        res.status(200).send(list);
    });
};

exports.updateBoss = function(req, res) {
    var boss = {
        bossName: req.body.bossName,
        currentBossLife: req.body.currentBossLife,
        maximumBossLife: req.body.maximumBossLife,
        serverName: req.body.serverName,
        status: req.body.status
    };
    BossRepository.updateBoss(boss, function (updatedBoss) {
        redis.hmset(boss.serverName, boss);
        var channel = boss.serverName+'CMS';
        redis.publish(channel, JSON.stringify(boss));
        res.status(200).send(updatedBoss);
    });
};