var mongoose = require('mongoose');
var modelHelpers = require('./modelHelpers.js');

var gameBaseStatSchema = new mongoose.Schema();

gameBaseStatSchema.add({
    baseDamage : Number,
    baseXP : Number,
    ultimateDamage : Number
});

gameBaseStatSchema.method('toJSON', modelHelpers.toJSON);

var GameBaseStat = mongoose.model('GameBaseStat', gameBaseStatSchema);

exports.schema = gameBaseStatSchema;
exports.model = GameBaseStat;
