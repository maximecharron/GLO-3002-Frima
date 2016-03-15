var Boss = require('./../models/boss.js').model;
var bossRepository = require('./../repository/bossRepository.js');
var mongoose = require('mongoose');
var mongoUri = 'mongodb://localhost/testFrimaGameServer';
mongoose.connect(mongoUri);
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

describe('Boss repository does', function ()
{
    before(function (done)
    {
        currentBoss.save(function (err)
        {
            constantBoss.save(function (err)
            {
                done();
            });
        });
    });

    it('get constant boss list', function (done)
    {
        bossRepository.findConstantBossList(function (bosses)
        {
            assert.equal(1, bosses.length, 'Size is not 1.');
            assert.equal(bosses[0].serverName, constantBoss.serverName, 'serverName does not match.');
            done();
        });
    });

    it('get current boss list', function (done)
    {
        bossRepository.findBossList(function (bosses)
        {
            assert.equal(1, bosses.length, 'Size is not 1.');
            assert.equal(bosses[0].serverName, currentBoss.serverName, 'serverName does not match.');
            done();
        });
    });
    it('find Single Boss', function (done)
    {
        bossRepository.findBoss(currentBoss.serverName, function (boss)
        {
            assert.equal(boss.serverName, currentBoss.serverName, 'serverName does not match.');
            done();
        });
    });

    it('updates the boss', function (done)
    {
        var bossToUpdate = constantBoss;
        bossToUpdate.maximumBossLife = '1';
        bossRepository.updateBoss(bossToUpdate, function (updatedBoss)
        {
            assert.equal(updatedBoss.maximumBossLife, bossToUpdate.maximumBossLife, 'BossLife not updated');
            done();
        });
    });
    describe('falls back gracefully', function(){
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
            bossRepository.findConstantBossList(function (bosses)
            {
                assert.equal(null, bosses, 'Bosses is not null');
                done();
            });
        });
        it('if no current boss', function (done)
        {
            bossRepository.findBossList(function (bosses)
            {
                assert.equal(null, bosses, 'Bosses is not null');
                done();
            });
        });
        it('if no single Boss found', function (done)
        {
            bossRepository.findBoss(currentBoss.serverName, function (boss)
            {
                assert.equal(null, boss, 'A boss was found.');
                done();
            });
        });
    });
});
after(function(){
   Boss.remove({});
});



