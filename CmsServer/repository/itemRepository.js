var Item = require('./../models/item.js').model;

exports.findAllItems = function (callback)
{
    Item.find({}, function (err, result)
    {
        if (result && result.length > 0)
        {
            callback(result);
        } else
        {
            callback(null);
        }
    });
};

exports.findItem = function (name, callback)
{
    Item.findOne({"name": name}, function (err, result)
    {
        if (result)
        {
            callback(result);
        } else
        {
            callback(null);
        }
    });
};

exports.removeItem = function (id, callback)
{
    Item.findById(id, function (err, item)
        {
            if (!err)
            {
                if (item)
                {
                    item.remove();
                    callback(null, true);
                }
                else
                {
                    callback(null, false);
                }
            }
            else
            {
                callback(false);
            }
        }
    );
};


exports.updateItem = function (itemToUpdate, callback)
{
    this.findItem(itemToUpdate.name, function (item)
    {
        item.name = itemToUpdate.name;
        item.type = itemToUpdate.type;
        item.subType = itemToUpdate.subType;
        item.quantity = itemToUpdate.quantity;
        item.staminaRegeneration = itemToUpdate.staminaRegeneration;
        item.hypeGeneration = itemToUpdate.hypeGeneration;
        item.effectDuration = itemToUpdate.effectDuration;
        item.save(function (err, item)
        {
            if (err)
            {
                console.log(err);
            }
            callback(item);
        });
    });
};

exports.newItem = function (itemToCreate, callback)
{
    var item = new Item();
    item.name = itemToCreate.name;
    item.type = itemToCreate.type;
    item.subType = itemToCreate.subType;
    item.quantity = itemToCreate.quantity;
    item.staminaRegeneration = itemToCreate.staminaRegeneration;
    item.hypeGeneration = itemToCreate.hypeGeneration;
    item.effectDuration = itemToCreate.effectDuration;
    item.save(function (err, item)
    {
        if (err)
        {
            console.log(err);
        }
        callback(item);
    });
};
