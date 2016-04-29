var mocha = require('mocha');
var GameConfig = require('./../../models/gameConfig.js').model;
var assert = require('chai').assert;

describe('GameConfig Schema can', function () {

    it('Replace _id and delete __v', function () {
        var gameConfig = new GameConfig({
            baseAttackDamage : 1,
            baseExperienceIncreaseOnHit : 1,
            hypeAttackDamage : 1,
            maximumLevel : 1,
            experiencePerLevel: [ 1, 2 ],
            upgradePointsPerLevel : [ 1, 2 ],
            probabilityLoot : [ 1, 2 ]

        });
        var jsonGameConfig = gameConfig.toJSON();
        assert.isDefined(jsonGameConfig.id);
        assert.isObject(jsonGameConfig.id);
        assert.isUndefined(jsonGameConfig._id);
        assert.isUndefined(jsonGameConfig.__v);
    });

    it('Create correct JSON from object', function () {
        var gameConfig = new GameConfig({
            baseAttackDamage : 1,
            baseExperienceIncreaseOnHit : 1,
            hypeAttackDamage : 1,
            maximumLevel : 1,
            experiencePerLevel: [ 1, 2 ],
            upgradePointsPerLevel : [ 1, 2 ],
            probabilityLoot : [ 1, 2 ]

        });
        var jsonGameConfig = gameConfig.toJSON();
        assert.isDefined(jsonGameConfig.id);
        assert.isObject(jsonGameConfig.id);
        assert.equal(jsonGameConfig.baseAttackDamage, gameConfig.baseAttackDamage);
        assert.equal(jsonGameConfig.baseExperienceIncreaseOnHit, gameConfig.baseExperienceIncreaseOnHit);
        assert.equal(jsonGameConfig.hypeAttackDamage, gameConfig.hypeAttackDamage);
        assert.equal(jsonGameConfig.maximumLevel, gameConfig.maximumLevel);
        assert.sameMembers(jsonGameConfig.experiencePerLevel, gameConfig.experiencePerLevel);
        assert.sameMembers(jsonGameConfig.upgradePointsPerLevel, gameConfig.upgradePointsPerLevel);
        assert.sameMembers(jsonGameConfig.probabilityLoot, gameConfig.probabilityLoot);
    })
    ;
})