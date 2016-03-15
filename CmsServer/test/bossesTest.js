var proxyquire = require('proxyquire');
proxyquire.noPreserveCache();
var sinon = require('sinon');
var expect = require('chai').expect;
var bossRepository = require('./../repository/bossRepository.js');
var redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
var redis = require('redis').createClient(redisUrl);
var bossRepositoryStub = sinon.stub(bossRepository);
var redisStub = sinon.stub(redis);
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

before(function (done)
{
    sendSpy = sinon.spy(res, "send");
    statusSpy = sinon.spy(res, "status");
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
        bossRepositoryStub.findConstantBossList.callsArg(0);
        bosses.getConstantBossList(request, res);
        expect(bossRepositoryStub.findConstantBossList).to.have.been.calledOnce;
        expect(sendSpy).to.have.been.calledOnce;
        sinon.assert.calledOnce(sendSpy);
        sinon.assert.calledOnce(statusSpy);
        sinon.assert.calledWith(statusSpy, 200);

    });
    it('get boss list by calling bossRepository', function ()
    {
        bossRepositoryStub.findBossList.callsArg(0);
        bosses.getBossList(request, res);
        expect(bossRepositoryStub.findBossList).to.have.been.calledOnce;
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
        bossRepositoryStub.updateBoss.callsArgWith(1, request.body);
        bosses.updateBoss(request, res);
        expect(bossRepositoryStub.updateBoss).to.have.been.calledOnce;
        sinon.assert.calledOnce(sendSpy);
        sinon.assert.calledOnce(statusSpy);
        sinon.assert.calledWith(statusSpy, 200);
        sinon.assert.calledWith(sendSpy, boss);
    });
   //We need this because of proxyquire along with require cache that always returns the stubbed version. We don't always want that version.
    delete require.cache[require.resolve('./../repository/bossRepository.js')];
    delete require.cache[require.resolve('redis')];
});
