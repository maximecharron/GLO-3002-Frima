var mocha = require('mocha');
var Boss = require('./../models/boss.js').model;
var assert = require('chai').assert;

describe('Boss Schema can', function ()
{
    it('Create empty DTO with empty object', function ()
    {
        var boss = new Boss();
        var dtoBoss = boss.toDTO();
        assert.isDefined(dtoBoss.id);
        assert.isObject(dtoBoss.id);
        assert.isUndefined(dtoBoss.bossName);
        assert.isUndefined(dtoBoss.maximumBossLife);
        assert.isUndefined(dtoBoss.currentBossLife);
        assert.isUndefined(dtoBoss.serverName);
        assert.isUndefined(dtoBoss.status);
    });

    it('Create correct DTO from object', function ()
    {
        var boss = new Boss({
            bossName: "Test",
            maximumBossLife: "1000",
            currentBossLife: "1000",
            serverName: "Test",
            status: "ALIVE"

        });
        var dtoBoss = boss.toDTO();
        assert.isDefined(dtoBoss.id);
        assert.isObject(dtoBoss.id);
        assert.equal(dtoBoss.bossName, boss.bossName);
        assert.equal(dtoBoss.maximumBossLife, boss.maximumBossLife);
        assert.equal(dtoBoss.currentBossLife, boss.currentBossLife);
        assert.equal(dtoBoss.serverName, boss.serverName);
        assert.equal(dtoBoss.status, boss.status);
    });

    it('Replace _id and delete __v', function ()
    {
        var boss = new Boss({
            bossName: "Test",
            maximumBossLife: "1000",
            currentBossLife: "1000",
            serverName: "Test",
            status: "ALIVE"

        });
        var jsonBoss = boss.toJSON();
        assert.isDefined(jsonBoss.id);
        assert.isObject(jsonBoss.id);
        assert.isUndefined(jsonBoss._id);
        assert.isUndefined(jsonBoss.__v);
    });

    it('Create correct JSON from object', function ()
    {
        var boss = new Boss({
            bossName: "Test",
            maximumBossLife: "1000",
            currentBossLife: "1000",
            serverName: "Test",
            status: "ALIVE"

        });
        var jsonBoss = boss.toJSON();
    assert.isDefined(jsonBoss.id);
    assert.isObject(jsonBoss.id);
    assert.equal(jsonBoss.bossName, boss.bossName);
    assert.equal(jsonBoss.maximumBossLife, boss.maximumBossLife);
    assert.equal(jsonBoss.currentBossLife, boss.currentBossLife);
    assert.equal(jsonBoss.serverName, boss.serverName);
    assert.equal(jsonBoss.status, boss.status);
});
})
;