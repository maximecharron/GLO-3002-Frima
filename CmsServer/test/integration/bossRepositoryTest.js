var Boss = require('./../../models/boss.js').model;
var bossRepository = require('./../../repository/bossRepository.js');
var mongoose = require('mongoose');
var mongoUri = 'mongodb://localhost/testFrimaGameServer';
var assert = require('chai').assert;

var currentBoss = new Boss({
    bossName: 'boss',
    maximumBossLife: '10000',
    currentBossLife: '10000',
    serverName: 'abc',
    status: '0'
});

var constantBoss = new Boss({
    bossName: 'boss',
    maximumBossLife: '10000',
    currentBossLife: '10000',
    serverName: 'abcConstant',
    status: '0'
});

describe('Boss repository ', function ()
{
    before(function (done)
    {
        mongoose.connect(mongoUri, function ()
        {
            Boss.remove({}, function ()
            {
                currentBoss.save(function (err)
                {
                    constantBoss.save(function (err)
                    {
                        done();
                    });
                });
            });
        });
    });

    it('gets constant boss list', function (done)
    {
        bossRepository.findBaseReferenceBosses(function (bosses)
        {
            assert.equal(bosses.length, 1);
            assert.equal(constantBoss.serverName, bosses[0].serverName);
            done();
        });
    });

    it('gets current boss list', function (done)
    {
        bossRepository.findBosses(function (bosses)
        {
            assert.equal(bosses.length, 1);
            assert.equal(currentBoss.serverName, bosses[0].serverName);
            done();
        });
    });
    it('finds Single Boss', function (done)
    {
        bossRepository.findBoss(currentBoss.serverName, function (boss)
        {
            assert.equal(currentBoss.serverName, boss.serverName);
            done();
        });
    });

    it('updates the boss', function (done)
    {
        var bossToUpdate = constantBoss;
        bossToUpdate.maximumBossLife = '1';
        bossRepository.updateBoss(bossToUpdate, function (updatedBoss)
        {
            assert.equal(updatedBoss.maximumBossLife, bossToUpdate.maximumBossLife);
            done();
        });
    });
    describe('falls back gracefully', function ()
    {
        before(function (done)
        {
            Boss.findOneAndRemove({serverName: 'abcConstant'}, {}, function ()
            {
                Boss.findOneAndRemove({serverName: 'abc'}, {}, function ()
                {
                    done();
                });
            });
        });
        it('if no constant boss', function (done)
        {
            bossRepository.findBaseReferenceBosses(function (bosses)
            {
                assert.equal(bosses, null);
                done();
            });
        });
        it('if no current boss', function (done)
        {
            bossRepository.findBosses(function (bosses)
            {
                assert.equal(bosses, null);
                done();
            });
        });
        it('if no single Boss found', function (done)
        {
            bossRepository.findBoss(currentBoss.serverName, function (boss)
            {
                assert.equal(boss, null);
                done();
            });
        });
    });
    after(function ()
    {
        Boss.remove({});
        mongoose.disconnect();
    });
});




