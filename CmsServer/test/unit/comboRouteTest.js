var proxyquire = require('proxyquire');
var sinon = require('sinon');
var comboRepositoryStub = {};
var redisStub = {};
var redisClientStub = {};
redisClientStub.publish = function (channel, message)
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
var combos = proxyquire('./../../routes/combos.js', {
    './../repository/comboRepository.js': comboRepositoryStub,
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
        name : "Test",
        triggerFrequency : 1,
        bonusMultiplier :1,
        triggerZone : 1,
        maxFirstHitWaitTime: 1,
        maxWaitTimeBetweenHits: 1,
        hitZones: 1
    },
    params: {
        id: "id",
    }
};
var sendSpy;
var statusSpy;
var comboRepositorySpy;
var redisPublishSpy;
//Stubs
comboRepositoryStub.updateCombo = function (combo, callback)
{
    callback(combo);
};

comboRepositoryStub.newCombo = function (combo, callback)
{
    callback(combo);
};

comboRepositoryStub.findAllCombos = function (callback)
{
    var list = [];
    callback(list);
};

comboRepositoryStub.removeCombo = function (id, callback)
{
    callback(null, true);
};
//Before all tests
before(function (done)
{
    sendSpy = sinon.spy(response, "send");
    statusSpy = sinon.spy(response, "status");
    redisPublishSpy = sinon.spy(redisClientStub, "publish");
    done();
});

describe('Combos route does', function ()
{
    beforeEach(function ()
    {
        sendSpy.reset();
        statusSpy.reset();
        redisPublishSpy.reset();
    });
    it('get combos list by calling combosRepository', function ()
    {
        comboRepositorySpy = sinon.spy(comboRepositoryStub, "findAllCombos");
        combos.getCombos(request, response);
        sinon.assert.calledOnce(comboRepositorySpy);
        sinon.assert.calledOnce(sendSpy);
        sinon.assert.calledOnce(statusSpy);
        sinon.assert.calledWith(statusSpy, 200);

    });
    it('delete combo by calling combosRepository', function ()
    {
        comboRepositorySpy = sinon.spy(comboRepositoryStub, "removeCombo");
        combos.deleteCombo(request, response);
        sinon.assert.calledOnce(comboRepositorySpy);
        sinon.assert.calledOnce(sendSpy);
        sinon.assert.calledWith(statusSpy, 200);
        sinon.assert.calledOnce(statusSpy);

    });
    it('update combo by calling combosRepository', function ()
    {
        var boss = {
            name : request.body.name,
            triggerFrequency : request.body.triggerFrequency,
            bonusMultiplier : request.body.bonusMultiplier,
            triggerZone : request.body.triggerZone,
            maxFirstHitWaitTime: request.body.maxFirstHitWaitTime,
            maxWaitTimeBetweenHits: request.body.maxWaitTimeBetweenHits,
            hitZones: request.body.hitZones
        };
        comboRepositorySpy = sinon.spy(comboRepositoryStub, "updateCombo");
        combos.updateCombo(request, response);
        sinon.assert.calledOnce(redisPublishSpy);
        sinon.assert.calledOnce(comboRepositorySpy);
        sinon.assert.calledOnce(sendSpy);
        sinon.assert.calledOnce(statusSpy);
        sinon.assert.calledWith(statusSpy, 200);
        sinon.assert.calledWith(sendSpy, boss);
    });

    it('create new combo by calling combosRepository', function ()
    {
        var boss = {
            name : request.body.name,
            triggerFrequency : request.body.triggerFrequency,
            bonusMultiplier : request.body.bonusMultiplier,
            triggerZone : request.body.triggerZone,
            maxFirstHitWaitTime: request.body.maxFirstHitWaitTime,
            maxWaitTimeBetweenHits: request.body.maxWaitTimeBetweenHits,
            hitZones: request.body.hitZones
        };
        comboRepositorySpy = sinon.spy(comboRepositoryStub, "newCombo");
        combos.newCombo(request, response);
        sinon.assert.calledOnce(redisPublishSpy);
        sinon.assert.calledOnce(comboRepositorySpy);
        sinon.assert.calledOnce(sendSpy);
        sinon.assert.calledOnce(statusSpy);
        sinon.assert.calledWith(statusSpy, 200);
        sinon.assert.calledWith(sendSpy, boss);
    });

});
