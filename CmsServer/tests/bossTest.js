var test = require('unit.js');
var mocha = require('mocha');
var Boss = require('./../models/boss.js').model;
var assert = require('chai').assert;

describe('Boss Schema can', function () {
    it('Create empty DTO with empty object', function () {
        var boss;
        var dtoBoss;
        test.given(function () {
            boss = new Boss();
        })
            .when(function () {
                dtoBoss = boss.toDTO();
            })
            .then(function () {
                assert.isDefined(dtoBoss.id, "Id is defined");
                assert.isObject(dtoBoss.id, "Id is object");
                assert.isUndefined(dtoBoss.bossName, "Bossname is undefined");
                assert.isUndefined(dtoBoss.constantBossLife, "ConstantBossLife is undefined");
                assert.isUndefined(dtoBoss.currentBossLife, "CurrentBossLife is undefined");
                assert.isUndefined(dtoBoss.serverName, "ServerName is undefined");
                assert.isUndefined(dtoBoss.status, "Status is undefined");
            })

    })

    it('Create correct DTO from object', function () {
        var boss;
        var dtoBoss;
        test.given(function () {
            boss = new Boss({
                bossName: "Test",
                constantBossLife: "1000",
                currentBossLife: "1000",
                serverName: "Test",
                status: "ALIVE"

            });
        })
            .when(function () {
                dtoBoss = boss.toDTO();
            })
            .then(function () {
                assert.isDefined(dtoBoss.id, "Id is defined");
                assert.isObject(dtoBoss.id, "Id is object");
                assert.equal(dtoBoss.bossName, boss.bossName, "Bossname are equals");
                assert.equal(dtoBoss.constantBossLife, boss.constantBossLife, "ConstantBossLife are equals");
                assert.equal(dtoBoss.currentBossLife, boss.currentBossLife, "CurrentBossLife are equals");
                assert.equal(dtoBoss.serverName, boss.serverName, "ServerName are equals");
                assert.equal(dtoBoss.status, boss.status, "Status are equals");
            })

    })

    it('Replace _id and delete __v', function () {
        var boss;
        var jsonBoss;
        test.given(function () {
            boss = new Boss({
                bossName: "Test",
                constantBossLife: "1000",
                currentBossLife: "1000",
                serverName: "Test",
                status: "ALIVE"

            });
        })
            .when(function () {
                jsonBoss = boss.toJSON();
            })
            .then(function () {
                assert.isDefined(jsonBoss.id, "Id is defined");
                assert.isObject(jsonBoss.id, "Id is object");
                assert.isUndefined(jsonBoss._id, "_id is undefined");
                assert.isUndefined(jsonBoss.__v, "__v is undefined");
            })

    })

    it('Create correct JSON from object', function () {
        var boss;
        var jsonBoss;
        test.given(function () {
            boss = new Boss({
                bossName: "Test",
                constantBossLife: "1000",
                currentBossLife: "1000",
                serverName: "Test",
                status: "ALIVE"

            });
        })
            .when(function () {
                jsonBoss = boss.toJSON();
            })
            .then(function () {
                assert.isDefined(jsonBoss.id, "Id is defined");
                assert.isObject(jsonBoss.id, "Id is object");
                assert.equal(jsonBoss.bossName, boss.bossName, "Bossname are equals");
                assert.equal(jsonBoss.constantBossLife, boss.constantBossLife, "ConstantBossLife are equals");
                assert.equal(jsonBoss.currentBossLife, boss.currentBossLife, "CurrentBossLife are equals");
                assert.equal(jsonBoss.serverName, boss.serverName, "ServerName are equals");
                assert.equal(jsonBoss.status, boss.status, "Status are equals");
            })

    })
});