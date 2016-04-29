var proxyquire = require('proxyquire');
var sinon = require('sinon');
var gameConfigRepositoryStub = {};
var redisStub = {};
var redisClientStub = {};
redisClientStub.publish = function (channel, message)
{
    /* Empty method stub */
};

redisStub.createClient = function(url){
    return redisClientStub;
};
var gameConfig = proxyquire('./../../routes/gameConfig.js', {
    './../repository/gameConfigRepository.js': gameConfigRepositoryStub,
    'redis': redisStub
});
var response = {
    status: function (status)
    {
        return this;
    },
    send: function (object)
    {
        /* Empty method stub */
    }
};
var request = {
    body: {
        baseExperienceIncreaseOnHit : 1,
        baseAttackDamage : 1,
        hypeAttackDamage : 1,
        maximumLevel : 1,
        experiencePerLevel: 1,
        upgradePointsPerLevel : 1,
        probabilityLoot : 1
    }
};
var sendSpy;
var statusSpy;
var gameConfigRepositorySpy;
var redisPublishSpy;
//Stubs
gameConfigRepositoryStub.updateGameConfig = function (gameConfig, callback)
{
    callback(gameConfig);
};


gameConfigRepositoryStub.findGameConfig = function (callback)
{
    var list = [];
    callback(list);
};

//Before all tests
before(function (done)
{
    sendSpy = sinon.spy(response, "send");
    statusSpy = sinon.spy(response, "status");
    redisPublishSpy = sinon.spy(redisClientStub, "publish");
    done();
});

describe('GameConfig route does', function ()
{
    beforeEach(function ()
    {
        sendSpy.reset();
        statusSpy.reset();
        redisPublishSpy.reset();
    });
    it('get gameconfig by calling gameConfigRepository', function ()
    {
        gameConfigRepositorySpy = sinon.spy(gameConfigRepositoryStub, "findGameConfig");
        gameConfig.getGameConfig(request, response);
        sinon.assert.calledOnce(gameConfigRepositorySpy);
        sinon.assert.calledOnce(sendSpy);
        sinon.assert.calledOnce(statusSpy);
        sinon.assert.calledWith(statusSpy, 200);

    });

    it('update combo by calling gameConfigRepository', function ()
    {
        var boss = {
            baseExperienceIncreaseOnHit : request.body.baseExperienceIncreaseOnHit,
            baseAttackDamage : request.body.baseAttackDamage,
            hypeAttackDamage : request.body.hypeAttackDamage,
            maximumLevel : request.body.maximumLevel,
            experiencePerLevel: request.body.experiencePerLevel,
            upgradePointsPerLevel : request.body.upgradePointsPerLevel,
            probabilityLoot : request.body.probabilityLoot
        };
        gameConfigRepositorySpy = sinon.spy(gameConfigRepositoryStub, "updateGameConfig");
        gameConfig.updateGameConfig(request, response);
        sinon.assert.calledOnce(redisPublishSpy);
        sinon.assert.calledOnce(gameConfigRepositorySpy);
        sinon.assert.calledOnce(sendSpy);
        sinon.assert.calledOnce(statusSpy);
        sinon.assert.calledWith(statusSpy, 200);
        sinon.assert.calledWith(sendSpy, boss);
    });

});
