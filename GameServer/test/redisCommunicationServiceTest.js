var cache = require.cache;
for (var moduleId in cache) {
    delete cache[moduleId];
}

var proxyquire = require('proxyquire');
var expect = require('chai').expect;
var sinon = require("sinon");
var hostname = require('os').hostname();
var redisStub = {};
var redisClientStub = {};
redisStub.createClient = function(url)
{
    return redisClientStub;
}

var redisHmsetSpy;
var redisPublishSpy;
var redisHgetAllSpy;
var RedisCommunicationService = proxyquire('./../services/redisCommunicationService.js', {'redis': redisStub});

redisClientStub.hmset = function (key, values) {};
redisClientStub.publish = function (key, values) {};
redisClientStub.hgetall = function (key, callback) {callback()};

before(function(done){
    redisHmsetSpy = sinon.spy(redisClientStub, "hmset");
    redisPublishSpy = sinon.spy(redisClientStub, "publish");
    redisHgetAllSpy = sinon.spy(redisClientStub, "hgetall");
    done();
})

describe("redisCommunicationService", function ()
{
    beforeEach(function(done)
    {
        redisHmsetSpy.reset();
        redisPublishSpy.reset();
        redisHgetAllSpy.reset();
        done();
    })
    describe("setBoss", function()
    {
        it("should call set on redis", function()
        {
            //Arrange
            var bossStub = {toJson:function(){}};
            var redisCommunicationService = new RedisCommunicationService();

            //Act
            redisCommunicationService.setBoss(bossStub);

            //Assert
            sinon.assert.calledOnce(redisHmsetSpy);
        });
    });

    describe("setBossCurrentLife", function()
    {
        it("should call set on redis", function()
        {
            //Arrange
            var bossLife = 10;
            var redisCommunicationService = new RedisCommunicationService();

            //Act
            redisCommunicationService.setBossCurrentLife(bossLife);

            //Assert
            sinon.assert.calledOnce(redisHmsetSpy);
        });
    });

    describe("publishBossDead", function()
    {
        it("should publish on redis", function()
        {
            //Arrange
            var bossString = "bossDead";
            var redisCommunicationService = new RedisCommunicationService();

            //Act
            redisCommunicationService.publishBossDead(bossString);

            //Assert
            sinon.assert.calledOnce(redisPublishSpy);
        });
    });

    describe("findBoss", function()
    {
        it("should getall on redis", function()
        {
            //Arrange
            var redisCommunicationService = new RedisCommunicationService();
            var callback = function(object){ };
            //Act
            redisCommunicationService.findBoss(hostname, callback)

            //Assert
            sinon.assert.calledOnce(redisHgetAllSpy);
        });
    });
});