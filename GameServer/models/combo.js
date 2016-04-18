var mongoose = require('mongoose');
var modelHelpers = require('./modelHelpers.js');

var comboSchema = new mongoose.Schema();

comboSchema.add({
    name : String,
    triggerFrequency : Number,
    bonusMultiplier : Number,
    triggerZone : Object,
    maxFirstHitWaitTime: Number,
    maxWaitTimeBetweenHits: Number,
    hitZones: [object]
},{ strict : false });

comboSchema.method('toJSON', modelHelpers.toJSON);

var Combo = mongoose.model('Combo', comboSchema);

exports.schema = comboSchema;
exports.model = Combo;

exports.findCombos = function(callback){
    Combo.find({}, function(err, combos){
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
