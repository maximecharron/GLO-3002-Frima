var mongoose = require('mongoose');
var modelHelpers = require('./modelHelpers.js');
var Point = require('./point.js').schema;

var comboSchema = new mongoose.Schema({
    name : String,
    triggerFrequency : Number,
    bonusMultiplier : Number,
    triggerZone : mongoose.Schema.Types.Mixed,
    maxFirstHitWaitTime: Number,
    maxWaitTimeBetweenHits: Number,
    hitZones: [mongoose.Schema.Types.Mixed]
},{ strict : false });

comboSchema.method('toJSON', modelHelpers.toJSON);

var Combo = mongoose.model('Combo', comboSchema);

exports.schema = comboSchema;
exports.model = Combo;

exports.findCombos = function(callback){
    Combo.find({}, function(err, combos){
        console.log(combos);
        if(combos)
        {
            callback(combos);
        }
        else if(err){
            console.log("Problem to fetch combos in mongo: ", combos);
        }
        else{
            callback(null);
        }
    })
};