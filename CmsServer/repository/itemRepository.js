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
        item.save(function (err, combo)
        {
            if (err)
            {
                console.log(err);
            }
            callback(combo);
        });
    });
};
