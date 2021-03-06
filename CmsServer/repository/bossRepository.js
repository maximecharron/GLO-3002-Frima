var Boss = require('./../models/boss.js').model;

exports.findBaseReferenceBosses = function (callback) {
    Boss.find({"serverName": new RegExp('Constant$', "i")}, function (err, result) {
        if (result && result.length > 0) {
            callback(result);
        } else {
            callback(null);
        }
    });
};

exports.findBosses = function (callback) {
    Boss.find({"serverName": {$not: new RegExp('Constant$', "i")}}, function (err, result) {
        if (result && result.length > 0) {
            callback(result);
        } else {
            callback(null);
        }
    });
};

exports.findBoss = function (serverName, callback) {
    Boss.findOne({"serverName": serverName}, function (err, result) {
        if (result) {
            callback(result);
        } else {
            callback(null);
        }
    });
};

exports.updateBoss = function (bossToUpdate, callback) {
    this.findBoss(bossToUpdate.serverName, function (boss) {
        boss.currentBossLife = bossToUpdate.currentBossLife;
        boss.maximumBossLife = bossToUpdate.maximumBossLife;
        boss.status = bossToUpdate.status;
        boss.bossName = bossToUpdate.bossName;
        boss.save(function (err, boss) {
            if (err) {
                console.log(err);
            }
            callback(boss);
        });
    });
};
