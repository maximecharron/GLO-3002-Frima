var proxyquire = require('proxyquire');
var test = require('unit.js');
var sinon = require('sinon');
var mocha = require('mocha');
var bossRepositoryStub = {};
var redisStub = {};
var redisClientStub = {};
redisClientStub.publish = function (channel, message)
{
};

redisClientStub.hmset = function (key, values)
{
};
redisStub.createClient = function(url){
    return redisClientStub;
};
var bosses = proxyquire('./../routes/bosses.js', {
    './../repository/bossRepository.js': bossRepositoryStub,
    'redis': redisStub
});
var res = {
    status: function (status)
    {
        return this;
    },
    send: function (object)
    {
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
var bossRepoSpy;
var redisHmsetSpy;
var redisPublishSpy;
//Stubs
bossRepositoryStub.updateBoss = function (boss, callback)
{
    callback(boss);
};

bossRepositoryStub.findConstantBossList = function (callback)
{
    var list = [];
    callback(list);
};

bossRepositoryStub.findBossList = function (callback)
{
    var list = [];
    callback(list);
};
//Before all tests
before(function (done)
{
    sendSpy = sinon.spy(res, "send");
    statusSpy = sinon.spy(res, "status");
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
        bossRepoSpy = sinon.spy(bossRepositoryStub, "findConstantBossList");
        bosses.getConstantBossList(request, res);
        sinon.assert.calledOnce(bossRepoSpy);
        sinon.assert.calledOnce(sendSpy);
        sinon.assert.calledOnce(statusSpy);
        sinon.assert.calledWith(statusSpy, 200);

    });
    it('get boss list by calling bossRepository', function ()
    {
        bossRepoSpy = sinon.spy(bossRepositoryStub, "findBossList");
        bosses.getBossList(request, res);
        sinon.assert.calledOnce(bossRepoSpy);
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
        bossRepoSpy = sinon.spy(bossRepositoryStub, "updateBoss");
        bosses.updateBoss(request, res);
        sinon.assert.calledOnce(redisHmsetSpy);
        sinon.assert.calledOnce(redisPublishSpy);
        sinon.assert.calledOnce(bossRepoSpy);
        sinon.assert.calledOnce(sendSpy);
        sinon.assert.calledOnce(statusSpy);
        sinon.assert.calledWith(statusSpy, 200);
        sinon.assert.calledWith(sendSpy, boss);
    });

});