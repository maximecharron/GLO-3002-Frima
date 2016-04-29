var mocha = require('mocha');
var Combo = require('./../../models/combo.js').model;
var assert = require('chai').assert;

describe('Combo Schema can', function () {

    it('Replace _id and delete __v', function () {
        var combo = new Combo({
            name: "Test",
            triggerFrequency: 1,
            bonusMultiplier: 1,
            triggerZone: {x: 1, y: 1, width: 1, height: 1},
            maxFirstHitWaitTime: 1,
            maxWaitTimeBetweenHits: 1,
            hitZones: [{x: 1, y: 1}, {x: -2, y: 2}]

        });
        var jsonCombo = combo.toJSON();
        assert.isDefined(jsonCombo.id);
        assert.isObject(jsonCombo.id);
        assert.isUndefined(jsonCombo._id);
        assert.isUndefined(jsonCombo.__v);
    });

    it('Create correct JSON from object', function () {
        var combo = new Combo({
            name: "Test",
            triggerFrequency: 1,
            bonusMultiplier: 1,
            triggerZone: {x: 1, y: 1, width: 1, height: 1},
            maxFirstHitWaitTime: 1,
            maxWaitTimeBetweenHits: 1,
            hitZones: [{x: 1, y: 1}, {x: -2, y: 2}]

        });
        var jsonCombo = combo.toJSON();
        console.log(jsonCombo)
        assert.isDefined(jsonCombo.id);
        assert.isObject(jsonCombo.id);
        assert.equal(jsonCombo.name, combo.name);
        assert.equal(jsonCombo.triggerFrequency, combo.triggerFrequency);
        assert.equal(jsonCombo.bonusMultiplier, combo.bonusMultiplier);
        assert.equal(jsonCombo.triggerZone.x, combo.triggerZone.x);
        assert.equal(jsonCombo.triggerZone.y, combo.triggerZone.y);
        assert.equal(jsonCombo.triggerZone.width, combo.triggerZone.width);
        assert.equal(jsonCombo.triggerZone.height, combo.triggerZone.height);
        assert.equal(jsonCombo.maxFirstHitWaitTime, combo.maxFirstHitWaitTime);
        assert.equal(jsonCombo.maxWaitTimeBetweenHits, combo.maxWaitTimeBetweenHits);
        assert.sameDeepMembers(jsonCombo.hitZones, combo.hitZones);
    })
    ;
})