var Item = require('./../../models/item.js').model;
var itemRepository = require('./../../repository/itemRepository.js');
var mongoose = require('mongoose');
var mongoUri = 'mongodb://localhost/testFrimaGameServer';
mongoose.connect(mongoUri);
var assert = require('chai').assert;

var item = new Item({
    type : 1,
    subType : 1,
    name : "Test",
    quantity : 1,
    staminaRegeneration: 1,
    hypeGeneration: 1,
    effectDuration: 1

});

var secondItem = new Item({
    type : 1,
    subType : 1,
    name : "Test2",
    quantity : 1,
    staminaRegeneration: 1,
    hypeGeneration: 1,
    effectDuration: 1

});

var newItem = new Item({
    type : 1,
    subType : 1,
    name : "newItem",
    quantity : 1,
    staminaRegeneration: 1,
    hypeGeneration: 1,
    effectDuration: 1

});

describe('Item repository ', function ()
{
    before(function (done)
    {
        item.save(function (err)
        {
            secondItem.save(function(err){
                done();
            });
        });
    });

    it('gets items list', function (done)
    {
        itemRepository.findAllItems(function (items)
        {
            assert.equal(items.length, 2);
            done();
        });
    });

    it('finds Single item', function (done)
    {
        itemRepository.findBoss(secondItem.name, function (item)
        {
            assert.equal(secondItem.name, item.name);
            done();
        });
    });

    it('updates the item', function (done)
    {
        var itemToUpdate = secondItem;
        itemToUpdate.staminaRegeneration = 2;
        itemRepository.updateItem(itemToUpdate, function (updatedItem)
        {
            assert.equal(updatedItem.staminaRegeneration, itemToUpdate.staminaRegeneration);
            done();
        });
    });

    it('creates new item', function (done)
    {
        var itemToCreate = newItem;
        itemRepository.newItem(itemToCreate, function (updatedItem)
        {
            itemRepository.findAllItems(function(items){
                assert.equal(items.length, 3);
                done();
            });
        });
    });

    it('deletes item', function (done)
    {
        itemRepository.findItem(newItem.name, function (item)
        {
            itemRepository.removeItem(item.id, function(error, success){
                assert.isNull(error);
                assert.isTrue(success);
                done();
            });
        });
    });

    after(function(){
        Item.remove({});
    });
});




