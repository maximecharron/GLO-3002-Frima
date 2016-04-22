var mongoose = require('mongoose');
var modelHelpers = require('./modelHelpers.js');
var hostname = require('os').hostname();
var bossSchema = new mongoose.Schema();
bossSchema.add({
    bossName : String,
    maximumBossLife: Number,
    currentBossLife: Number,
    serverName: String,
    status: Number
});

bossSchema.methods.toDTO = function () {
    var obj = this.toObject();

    var dto = {
        id: obj._id,
        bossName : obj.bossName,
        maximumBossLife: obj.maximumBossLife,
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