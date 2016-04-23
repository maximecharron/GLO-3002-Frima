var mongoose = require('mongoose');
var modelHelpers = require('./modelHelpers.js');

var gameConfigSchema = new mongoose.Schema({
    baseAttackDamage : Number,
    baseExperienceIncreaseOnHit : Number,
    hypeAttackDamage : Number,
    maximumLevel : Number,
    levelXPTree: [Number],
    upgradePointsPerLevel : [Number],
    probabilityLoot : [Number]
}, {strict: false});

gameConfigSchema.method('toJSON', modelHelpers.toJSON);

var GameConfig = mongoose.model('GameConfig', gameConfigSchema);

exports.schema = gameConfigSchema;
exports.model = GameConfig;
