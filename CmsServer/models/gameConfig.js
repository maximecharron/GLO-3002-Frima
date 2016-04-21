var mongoose = require('mongoose');
var modelHelpers = require('./modelHelpers.js');

var gameConfigSchema = new mongoose.Schema();

gameConfigSchema.add({
    baseAttackDamage : Number,
    baseExperienceIncreaseOnHit : Number,
    hypeAttackDamage : Number
});

gameConfigSchema.method('toJSON', modelHelpers.toJSON);

var GameConfig = mongoose.model('GameConfig', gameConfigSchema);

exports.schema = gameConfigSchema;
exports.model = GameConfig;
