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

exports.removeItem = function (name, callback)
{
    Item.remove({"name": name}, function (err)
    {
        if (!err)
        {
            callback();
        } else
        {
            callback();
        }
    });
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
