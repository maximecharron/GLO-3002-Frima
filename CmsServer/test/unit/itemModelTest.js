var mocha = require('mocha');
var Item = require('./../../models/item.js').model;
var assert = require('chai').assert;

describe('Item Schema can', function () {

    it('Replace _id and delete __v', function () {
        var item = new Item({
            type : 1,
            subType : 1,
            name : "Test",
            quantity : 1,
            staminaRegeneration: 1,
            hypeGeneration: 1,
            effectDuration: 1

        });
        var jsonCombo = item.toJSON();
        assert.isDefined(jsonCombo.id);
        assert.isObject(jsonCombo.id);
        assert.isUndefined(jsonCombo._id);
        assert.isUndefined(jsonCombo.__v);
    });

    it('Create correct JSON from object', function () {
        var item = new Item({
            type : 1,
            subType : 1,
            name : "Test",
            quantity : 1,
            staminaRegeneration: 1,
            hypeGeneration: 1,
            effectDuration: 1

        });
        var jsonItem = item.toJSON();
        assert.isDefined(jsonItem.id);
        assert.isObject(jsonItem.id);
        assert.equal(jsonItem.name, item.name);
        assert.equal(jsonItem.type, item.type);
        assert.equal(jsonItem.subType, item.subType);
        assert.equal(jsonItem.quantity, item.quantity);
        assert.equal(jsonItem.staminaRegeneration, item.staminaRegeneration);
        assert.equal(jsonItem.hypeGeneration, item.hypeGeneration);
        assert.equal(jsonItem.effectDuration, item.effectDuration);
    })
    ;
})