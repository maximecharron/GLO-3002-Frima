var proxyquire = require('proxyquire');
var sinon = require('sinon');
var itemRepositoryStub = {};
var redisStub = {};
var redisClientStub = {};
redisClientStub.publish = function (channel, message)
{
    /* Empty method stub */
};

redisStub.createClient = function(url){
    return redisClientStub;
};
var items = proxyquire('./../../routes/item.js', {
    './../repository/itemRepository.js': itemRepositoryStub,
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
        name: "test",
        type: 1,
        subType: 1,
        quantity: 1,
        staminaRegeneration: 1,
        hypeGeneration: 1,
        effectDuration: 1
    },
    params: {
        id: "id",
    }
};
var sendSpy;
var statusSpy;
var itemRepositorySpy;
var redisPublishSpy;
//Stubs
itemRepositoryStub.updateItem = function (combo, callback)
{
    callback(combo);
};

itemRepositoryStub.newItem = function (combo, callback)
{
    callback(combo);
};

itemRepositoryStub.findAllItems = function (callback)
{
    var list = [];
    callback(list);
};

itemRepositoryStub.removeItem = function (id, callback)
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

describe('Items route does', function ()
{
    beforeEach(function ()
    {
        sendSpy.reset();
        statusSpy.reset();
        redisPublishSpy.reset();
    });
    it('get items list by calling itemRepository', function ()
    {
        itemRepositorySpy = sinon.spy(itemRepositoryStub, "findAllItems");
        items.getItems(request, response);
        sinon.assert.calledOnce(itemRepositorySpy);
        sinon.assert.calledOnce(sendSpy);
        sinon.assert.calledOnce(statusSpy);
        sinon.assert.calledWith(statusSpy, 200);

    });
    it('delete item by calling itemRepository', function ()
    {
        itemRepositorySpy = sinon.spy(itemRepositoryStub, "removeItem");
        items.deleteItem(request, response);
        sinon.assert.calledOnce(itemRepositorySpy);
        sinon.assert.calledOnce(sendSpy);
        sinon.assert.calledWith(statusSpy, 200);
        sinon.assert.calledOnce(statusSpy);

    });
    it('update item by calling itemRepository', function ()
    {
        var boss = {
            name: request.body.name,
            type: request.body.type,
            subType: request.body.subType,
            quantity: request.body.quantity,
            staminaRegeneration: request.body.staminaRegeneration,
            hypeGeneration: request.body.hypeGeneration,
            effectDuration: request.body.effectDuration
        };
        itemRepositorySpy = sinon.spy(itemRepositoryStub, "updateItem");
        items.updateItem(request, response);
        sinon.assert.calledOnce(redisPublishSpy);
        sinon.assert.calledOnce(itemRepositorySpy);
        sinon.assert.calledOnce(sendSpy);
        sinon.assert.calledOnce(statusSpy);
        sinon.assert.calledWith(statusSpy, 200);
        sinon.assert.calledWith(sendSpy, boss);
    });

    it('create new combo by calling itemRepository', function ()
    {
        var boss = {
            name: request.body.name,
            type: request.body.type,
            subType: request.body.subType,
            quantity: request.body.quantity,
            staminaRegeneration: request.body.staminaRegeneration,
            hypeGeneration: request.body.hypeGeneration,
            effectDuration: request.body.effectDuration
        };
        itemRepositorySpy = sinon.spy(itemRepositoryStub, "newItem");
        items.createItem(request, response);
        sinon.assert.calledOnce(redisPublishSpy);
        sinon.assert.calledOnce(itemRepositorySpy);
        sinon.assert.calledOnce(sendSpy);
        sinon.assert.calledOnce(statusSpy);
        sinon.assert.calledWith(statusSpy, 200);
        sinon.assert.calledWith(sendSpy, boss);
    });

});
