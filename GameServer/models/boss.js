var mongoose = require('mongoose');
var modelHelpers = require('./modelHelpers.js');
var hostname = require('os').hostname();
var bossSchema = new mongoose.Schema();
bossSchema.add({
    bossName : String,
    constantBossLife: String,
    currentBossLife: String,
    status: String
});

bossSchema.methods.toDTO = function (following, withToken) {
    var obj = this.toObject();

    var dto = {
        id: obj._id,
        bossName : obj.bossName,
        constantBossLife: obj.constantBossLife,
        currentBossLife: obj.currentBossLife,
        status: obj.status
    };

    return dto;
};

bossSchema.method('toJSON', modelHelpers.toJSON);

var Boss = mongoose.model('Boss', bossSchema);

exports.schema = bossSchema;
exports.model = Boss;

exports.findConstantBoss = function(callback){
    Boss.findOne({"bossName": hostname}, function(err, result){
        if (result){
            callback(result)
        } else {
            callback(null);
        }
    })
}

exports.backupBoss = function(boss){
  Boss.findOne({"bossName": boss.bossName || boss.getName()}, function(err, result){
        if (result){
            result.constantBossLife = boss.constantBossLife || boss.getConstantLife();
            result.currentBossLife = boss.currentBossLife || boss.getLife();
            result.status = boss.status || boss.getStatus();
            result.save();
        } else {
            var bossToSave = new Boss({
                bossName: boss.bossName || boss.getName(),
                constantBossLife: boss.constantBossLife || boss.getConstantLife(),
                currentBossLife:  boss.currentBossLife || boss.getLife(),
                status: boss.status || boss.getStatus()
            });
            bossToSave.save();
        }
  })
};
