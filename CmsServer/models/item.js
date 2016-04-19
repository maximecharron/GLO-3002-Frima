var mongoose = require('mongoose');
var modelHelpers = require('./modelHelpers.js');
var Consumable = require('./../domain/items/consumable.js');

var itemSchema = new mongoose.Schema();

itemSchema.add({
    type : Number,
    subType : Number,
    name : String,
    quantity : Number,
    staminaRegeneration: Number,
    hypeGeneration: Number,
    effectDuration: Number
});

itemSchema.method('toJSON', modelHelpers.toJSON);

var Item = mongoose.model('Item', itemSchema);

exports.schema = itemSchema;
exports.model = Item;