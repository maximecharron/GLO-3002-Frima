var DbBoss =  require('./../models/boss.js')
var redisUrl = 'redis://h:p88tk5goahehq8c9hta4ugr533t@ec2-54-227-252-28.compute-1.amazonaws.com:7069';
var redis = require('redis').createClient(redisUrl);

exports.getConstantBossList = function(req, res){
    DbBoss.findConstantBossList(function(list){
        res.status(200).send(list);
    })
};

exports.getBossList = function(req, res){
    DbBoss.findBossList(function(list){
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
    DbBoss.updateBoss(boss, function (updatedBoss) {
        redis.hmset(boss.serverName, boss);
        redis.publish(boss.serverName, boss);
        res.status(200).send(updatedBoss);
    })
};