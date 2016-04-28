var GameConfig = require('./../../models/gameConfig.js').model;
var gameConfigRepository = require('./../../repository/gameConfigRepository.js');
var mongoose = require('mongoose');
var mongoUri = 'mongodb://localhost/testFrimaGameServer';
mongoose.connect(mongoUri);
var assert = require('chai').assert;

var gameConfig = new GameConfig({
    baseAttackDamage : 1,
    baseExperienceIncreaseOnHit : 1,
    hypeAttackDamage : 1,
    maximumLevel : 1,
    experiencePerLevel: [ 1, 2 ],
    upgradePointsPerLevel : [ 1, 2 ],
    probabilityLoot : [ 1, 2 ]

});

describe('GameConfig repository ', function ()
{
    before(function (done)
    {
        gameConfig.save(function (err)
        {
                done();
        });
    });

    it('gets game configs', function (done)
    {
        gameConfigRepository.findBaseReferenceBosses(function (gameConfig)
        {
            assert.equal(gameConfig.baseAttackDamage, gameConfig.baseAttackDamage);
            done();
        });
    });

    it('updates the boss', function (done)
    {
        var gameConfigToUpdate = gameConfig;
        gameConfigToUpdate.baseAttackDamage = 2;
        gameConfigRepository.updateBoss(gameConfigToUpdate, function (updatedGameConfig)
        {
            assert.equal(updatedGameConfig.maximumBossLife, gameConfigToUpdate.baseAttackDamage);
            done();
        });
    });
    after(function(){
        GameConfig.remove({});
    });
});




