var mongoose = require('mongoose');
var modelHelpers = require('./modelHelpers.js');
var hostname = process.env.SERVER_NAME || require('os').hostname();
var bossSchema = new mongoose.Schema();
bossSchema.add({
    serverName : String,
    bossName : String,
    maximumBossLife: String,
    currentBossLife: String,
    status: String
});

bossSchema.methods.toDTO = function () {
    var obj = this.toObject();

    var dto = {
        id: obj._id,
        serverName: obj.serverName,
        bossName : obj.bossName,
        maximumBossLife: obj.maximumBossLife,
        currentBossLife: obj.currentBossLife,
        status: obj.status
    };

    return dto;
};

bossSchema.method('toJSON', modelHelpers.toJSON);

var Boss = mongoose.model('Boss', bossSchema);

exports.schema = bossSchema;
exports.model = Boss;

exports.findBoss = function(serverName, callback){
    Boss.findOne({"serverName": serverName}, function(err, result){
        if (result){
            callback(result);
        } else {
            callback(null);
        }
    });
};

exports.backupBoss = function(boss){
  Boss.findOne({"serverName": hostname}, function(err, result){
        if (result){
            result.maximumBossLife = boss.maximumBossLife || boss.getMaximumLife();
            result.currentBossLife = boss.currentBossLife || boss.getLife();
            result.status = boss.status || boss.getStatus();
            result.save();
        } else {
            var bossToSave = new Boss({
                serverName: hostname,
                bossName: boss.bossName || boss.getName(),
                maximumBossLife: boss.maximumBossLife || boss.getMaximumLife(),
                currentBossLife:  boss.currentBossLife || boss.getLife(),
                status: boss.status || boss.getStatus()
            });
            bossToSave.save();
        }
  });
};
