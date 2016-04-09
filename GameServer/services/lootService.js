var self;
//Construction
function LootService(itemRepository)
{
    this.itemRepository = itemRepository;
    this.items = [];
    //this.probabilityLoot = [1,1,1,1,1,1,2,2,2,3];
    this.probabilityLoot = [2,2,2,2,2,2,2];

    self = this;

    this.initializeItems();
}

//public method
LootService.prototype.getLoot = function(){
    var itemsLoot = [];
    var itemQuantity = this.probabilityLoot[Math.floor((Math.random() * this.probabilityLoot.length))];

    for(var i = 0; i < itemQuantity; i++)
    {
        itemsLoot.push(this.items[Math.floor((Math.random() * this.items.length))]);
    }

    return itemsLoot;
};

LootService.prototype.createItemsCommand = function(items)
{
    var itemsJson = [];

    items.forEach(function each(item){
        var singleItemJson = item.toJson();
        itemsJson.push(singleItemJson);
    });

    var jsonToSend = {
        command: {
            name: "lootItems",
            parameters:{
                items: itemsJson
            }
        }
    };

    return JSON.stringify(jsonToSend);
};

LootService.prototype.initializeItems = function(){

    this.itemRepository.getItems(function(items){
        self.items = items;
    });
};

module.exports = LootService;