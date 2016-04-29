var Combo = require('./../../models/combo.js').model;
var comboRepository = require('./../../repository/comboRepository.js');
var mongoose = require('mongoose');
var mongoUri = 'mongodb://localhost/testFrimaGameServer';
var assert = require('chai').assert;

var combo = new Combo({
    name: "Test",
    triggerFrequency: 1,
    bonusMultiplier: 1,
    triggerZone: {x: 1, y: 1, width: 1, height: 1},
    maxFirstHitWaitTime: 1,
    maxWaitTimeBetweenHits: 1,
    hitZones: [{x: 1, y: 1}, {x: -2, y: 2}]

});

var secondCombo = new Combo({
    name: "Test2",
    triggerFrequency: 1,
    bonusMultiplier: 1,
    triggerZone: {x: 1, y: 1, width: 1, height: 1},
    maxFirstHitWaitTime: 1,
    maxWaitTimeBetweenHits: 1,
    hitZones: [{x: 1, y: 1}, {x: -2, y: 2}]

});

var newCombo = new Combo({
    name: "Test3",
    triggerFrequency: 1,
    bonusMultiplier: 1,
    triggerZone: {x: 1, y: 1, width: 1, height: 1},
    maxFirstHitWaitTime: 1,
    maxWaitTimeBetweenHits: 1,
    hitZones: [{x: 1, y: 1}, {x: -2, y: 2}]

});
describe('Combo repository ', function ()
{
    before(function (done)
    {
        mongoose.connect(mongoUri, function ()
        {
            Combo.remove({}, function ()
            {
                combo.save(function (err)
                {
                    secondCombo.save(function (err)
                    {
                        done();
                    });
                });
            });
        });
    });

    it('gets combos list', function (done)
    {
        comboRepository.findAllCombos(function (items)
        {
            assert.equal(items.length, 2);
            done();
        });
    });

    it('finds Single combo', function (done)
    {
        comboRepository.findCombo(secondCombo.name, function (combo)
        {
            assert.equal(secondCombo.name, combo.name);
            done();
        });
    });

    it('updates the item', function (done)
    {
        var comboToUpdate = secondCombo;
        comboToUpdate.maxWaitTimeBetweenHits = 2;
        comboRepository.updateCombo(comboToUpdate, function (updatedCombo)
        {
            assert.equal(updatedCombo.maxWaitTimeBetweenHits, comboToUpdate.maxWaitTimeBetweenHits);
            done();
        });
    });

    it('creates new combo', function (done)
    {
        var comboToCreate = newCombo;
        comboRepository.newCombo(comboToCreate, function (newCombo)
        {
            comboRepository.findAllCombos(function (combos)
            {
                assert.equal(combos.length, 3);
                done();
            });
        });
    });

    it('deletes combo', function (done)
    {
        comboRepository.findCombo(newCombo.name, function (combo)
        {
            comboRepository.removeCombo(combo._id, function (error, success)
            {
                assert.isNull(error);
                assert.isTrue(success);
                done();
            });
        });
    });

    after(function ()
    {
        Combo.remove({});
        mongoose.disconnect();
    });
});




