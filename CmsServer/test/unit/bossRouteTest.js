var proxyquire = require('proxyquire');
var sinon = require('sinon');
var bossRepositoryStub = {};
var redisStub = {};
var redisClientStub = {};
redisClientStub.publish = function (channel, message)
{
    /* Empty method stub */
};

redisClientStub.hmset = function (key, values)
{
    /* Empty method stub */
};
redisClientStub.set = function (key, values)
{
    /* Empty method stub */
};
redisStub.createClient = function(url){
    return redisClientStub;
};
var bosses = proxyquire('./../../routes/bosses.js', {
    './../repository/bossRepository.js': bossRepositoryStub,
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
        "bossName": "test",
        "currentBossLife": "1000",
        "maximumBossLife": "1000",
        "serverName": "test",
        "status": "ALIVE"
    }
};
var sendSpy;
var statusSpy;
var bossRepositorySpy;
var redisHmsetSpy;
var redisPublishSpy;
//Stubs
bossRepositoryStub.updateBoss = function (boss, callback)
{
    callback(boss);
};

bossRepositoryStub.findBaseReferenceBosses = function (callback)
{
    var list = [];
    callback(list);
};

bossRepositoryStub.findBosses = function (callback)
{
    var list = [];
    callback(list);
};
//Before all tests
before(function (done)
{
    sendSpy = sinon.spy(response, "send");
    statusSpy = sinon.spy(response, "status");
    redisHmsetSpy = sinon.spy(redisClientStub, "hmset");
    redisPublishSpy = sinon.spy(redisClientStub, "publish");
    done();
});

describe('Bosses route does', function ()
{
    beforeEach(function ()
    {
        sendSpy.reset();
        statusSpy.reset();
    });
    it('get constant boss list by calling bossRepository', function ()
    {
        bossRepositorySpy = sinon.spy(bossRepositoryStub, "findBaseReferenceBosses");
        bosses.getConstantBossList(request, response);
        sinon.assert.calledOnce(bossRepositorySpy);
        sinon.assert.calledOnce(sendSpy);
        sinon.assert.calledOnce(statusSpy);
        sinon.assert.calledWith(statusSpy, 200);

    });
    it('get boss list by calling bossRepository', function ()
    {
        bossRepositorySpy = sinon.spy(bossRepositoryStub, "findBosses");
        bosses.getBossList(request, response);
        sinon.assert.calledOnce(bossRepositorySpy);
        sinon.assert.calledOnce(sendSpy);
        sinon.assert.calledWith(statusSpy, 200);
        sinon.assert.calledOnce(statusSpy);

    });
    it('update boss by calling bossRepository', function ()
    {
        var boss = {
            bossName: request.body.bossName,
            currentBossLife: request.body.currentBossLife,
            maximumBossLife: request.body.maximumBossLife,
            serverName: request.body.serverName,
            status: request.body.status
        };
        bossRepositorySpy = sinon.spy(bossRepositoryStub, "updateBoss");
        bosses.updateBoss(request, response);
        sinon.assert.calledOnce(redisHmsetSpy);
        sinon.assert.calledOnce(redisPublishSpy);
        sinon.assert.calledOnce(bossRepositorySpy);
        sinon.assert.calledOnce(sendSpy);
        sinon.assert.calledOnce(statusSpy);
        sinon.assert.calledWith(statusSpy, 200);
        sinon.assert.calledWith(sendSpy, boss);
    });

});