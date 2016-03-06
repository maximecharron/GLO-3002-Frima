var mongoose = require('mongoose');
var modelHelpers = require('./modelHelpers.js');
var hostname = require('os').hostname();
var bossSchema = new mongoose.Schema();
bossSchema.add({
    bossName : String,
    constantBossLife: String,
    currentBossLife: String,
    serverName: String,
    status: String
});

bossSchema.methods.toDTO = function () {
    var obj = this.toObject();

    var dto = {
        id: obj._id,
        bossName : obj.bossName,
        constantBossLife: obj.constantBossLife,
        currentBossLife: obj.currentBossLife,
        serverName: obj.serverName,
        status: obj.status
    };
    return dto;
};

bossSchema.method('toJSON', modelHelpers.toJSON);

var Boss = mongoose.model('Boss', bossSchema);

exports.schema = bossSchema;
exports.model = Boss;

exports.findConstantBossList = function(callback){
    Boss.find({"serverName":new RegExp('Constant$', "i")}, function(err, result) {
        if (result){
            callback(result)
        } else {
            callback(null);
        }
    })
}

exports.findBoss = function(serverName, callback){
    Boss.findOne({"serverName": serverName}, function(err, result){
        if (result){
            callback(result)
        } else {
            callback(null);
        }
    })
};

exports.findBossList = function(callback){
    Boss.find({"serverName": {$not: new RegExp('Constant$', "i")}}, function(err, result) {
        if (result){
            callback(result)
        } else {
            callback(null);
        }
    })
};

exports.updateBoss = function(bossToUpdate, callback){
    this.findBoss(bossToUpdate.serverName, function(boss){
        boss.currentBossLife = bossToUpdate.currentBossLife;
        boss.constantBossLife = bossToUpdate.constantBossLife;
        boss.status = bossToUpdate.status;
        boss.bossName = bossToUpdate.bossName;
        boss.save(function(err, boss){
            if (err){
                console.log(err);
            }
            callback(boss);
        });
    })
}
