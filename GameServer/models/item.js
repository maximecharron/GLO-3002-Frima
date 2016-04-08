var mongoose = require('mongoose');
var modelHelpers = require('./modelHelpers.js');

var itemSchema = new mongoose.Schema();

itemSchema.add({
    type : String,
    name : String,
    quantity : Number,
    modifiedStats : { stamina : Number, hype : Number}
});

itemSchema.method('toJSON', modelHelpers.toJSON);

var Item = mongoose.model('Item', itemSchema);

exports.schema = itemSchema;
exports.model = Item;
