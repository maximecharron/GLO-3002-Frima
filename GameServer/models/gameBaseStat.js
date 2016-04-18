var mongoose = require('mongoose');
var modelHelpers = require('./modelHelpers.js');

var gameBaseStatSchema = new mongoose.Schema();

gameBaseStatSchema.add({
    type: String,
    baseDamage : Number,
    baseXP : Number,
    ultimateDamage : Number,
});

gameBaseStatSchema.method('toJSON', modelHelpers.toJSON);

var GameBaseStat = mongoose.model('Combo', gameBaseStatSchema);

exports.schema = gameBaseStatSchema;
exports.model = GameBaseStat;

exports.findGameBaseStat = function(callback){
    GameBaseStat.findOne( function(err, gameBaseStat){
        if(gameBaseStat)
        {
            callback(gameBaseStat);
        }
        else if(err){
            console.log("Problem to fetch gameBaseStat in mongo: ", gameBaseStat);
        }
        else{
            callback(null);
        }
    })
};
