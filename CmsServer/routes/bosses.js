var DbBoss =  require('./../models/boss.js')


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
    DbBoss.updateBoss(boss, function () {
        res.send(200);
    })
};