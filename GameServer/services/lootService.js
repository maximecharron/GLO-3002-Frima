var AdrenalineShot = require('./../domain/items/consumable/adrenalineShot.js');
var ProteinShake = require('./../domain/items/consumable/proteinShake.js');
var Belt = require('./../domain/items/wearable/belt.js');
var self;

//Construction
function LootService()
{
    self = this;
    this.items = [];
    initializeItems();
}

//public method
LootService.prototype.getLoot = function(){
    return self.items[Math.floor((Math.random() * self.items.length))];
}

//Public method
LootService.prototype.createItemCommand = function(item)
{
    return JSON.stringify(
        {
            command:
            {
                name: "lootItem",
                parameters: item.toJson()
            }
        });
};

//Private method
function initializeItems(){
    self.items.push(new AdrenalineShot(), new ProteinShake(), new Belt());
}




module.exports = LootService;