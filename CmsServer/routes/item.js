var ItemRepository = require('./../repository/itemRepository.js');
var redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
var redis = require('redis').createClient(redisUrl);
const OK = 200;

exports.getItems = function (request, response)
{
    ItemRepository.findAllItems(function (list)
    {
        response.status(OK).send(list);
    });
};

exports.deleteItem = function (request, response)
{
    ItemRepository.removeItem(request.params.id, function (error, success)
    {
        if (success)
        {
            response.status(OK).send();
        } else if(!error)
        {
            response.status(404).send();
        } else {
            response.status(500).send();
        }
    });
};

exports.updateItem = function (request, response)
{
    var item = {
        name: request.body.name,
        type: request.body.type,
        subType: request.body.subType,
        quantity: request.body.quantity,
        staminaRegeneration: request.body.staminaRegeneration,
        hypeGeneration: request.body.hypeGeneration,
        effectDuration: request.body.effectDuration
    };
    ItemRepository.updateItem(item, function (updatedItem)
    {
        var channel = "itemsUpdate";
        redis.publish(channel, "newItem");
        response.status(OK).send(updatedItem);
    });
};

exports.createItem = function (request, response)
{
    var item = {
        name: request.body.name,
        type: request.body.type,
        subType: request.body.subType,
        quantity: request.body.quantity,
        staminaRegeneration: request.body.staminaRegeneration,
        hypeGeneration: request.body.hypeGeneration,
        effectDuration: request.body.effectDuration
    };
    ItemRepository.newItem(item, function (createdItem)
    {
        var channel = "itemsUpdate";
        redis.publish(channel, "newItem");
        response.status(OK).send(createdItem);
    });
};