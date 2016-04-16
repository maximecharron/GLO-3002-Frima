var mongoose = require('mongoose');
var modelHelpers = require('./modelHelpers.js');
var Consumable = require('./../domain/items/consumable.js');

var itemSchema = new mongoose.Schema();

itemSchema.add({
    type : String,
    subType : String,
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

exports.findItems = function(callback){
    Item.find({}, function(err, items){
        if(items){
            var allItems = [];
            items.forEach(function each(item)
            {
                var consumable = new Consumable(item.type, item.subType, item.name, item.staminaRegeneration, item.hypeGeneration, item.effectDuration);
                allItems.push(consumable);
            });

            callback(allItems);
        }
        else if(err){
            console.log(items);
        }
        else{
            callback(null);
        }
    })
};
