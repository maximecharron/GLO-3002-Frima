var ItemModel = require('./../models/item.js');



//Constructor
function ItemRepository()
{

}

//Public method
ItemRepository.prototype.getItems = function(callBack) {
    ItemModel.findItems(function(items){
        callBack(items);
    });
}

module.exports = ItemRepository;
