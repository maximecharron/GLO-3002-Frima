var cache = require.cache;
for (var moduleId in cache) {
    delete cache[moduleId];
}

var proxyquire = require('proxyquire');
var expect = require('chai').expect;
var sinon = require("sinon");
var WebSocketServer  = require('ws').Server;

var BossCommunicationService = require('./../services/bossCommunicationService.js');


var webSocketServerStub;
before(function(done){
    webSocketServerStub = sinon.createStubInstance(WebSocketServer);
    done();
})

describe("bossCommunicationService", function ()
{
    beforeEach(function(done)
    {
        done();
    })
    describe("createBossStatusUpdate", function()
    {
        it("should return bossStatusUpdateString", function()
        {
            //Arrange
            var bossStub = {toJson:function(){}};
            var expectedString = JSON.stringify({command:{name:"bossStatusUpdate", parameters: bossStub.toJson}})

            var bossCommunicationService = new BossCommunicationService(webSocketServerStub);

            //Act
            var result = bossCommunicationService.createBossStatusUpdate(bossStub);

            //Assert
            expect(expectedString).to.equal(result);
        });
    });

    describe("broadcastBossDead", function()
    {
        it("should call send on clients", function()
        {
            //Arrange
            var bossStub = {toJson:function(){}};
            var expectedString = JSON.stringify({command:{name:"bossStatusUpdate", parameters: bossStub.toJson}})
            var client = {send: function(bossUpdate){}, close: function(){}};
            webSocketServerStub.clients = [client];

            var bossCommunicationService = new BossCommunicationService(webSocketServerStub);

            //Act
            var result = bossCommunicationService.broadcastBossDead(bossStub);

            //Assert
            expect(webSocketServerStub.send).to.have.been.calledOnce;
            expect(webSocketServerStub.close).to.have.been.calledOnce;
        });
    });

    describe("broadcastBossInformation", function()
    {
        it("should call send on clients", function()
        {/*
            //Arrange
            var bossStub = {toJson:function(){}};
            var expectedString = JSON.stringify({command:{name:"bossStatusUpdate", parameters: bossStub.toJson}})
            var client = {send: function(bossUpdate){}, close: function(){}};
            webSocketServerStub.clients = [client];

            var bossCommunicationService = new BossCommunicationService(webSocketServerStub);

            //Act
            var result = bossCommunicationService.broadcastBossDead(bossStub);

            //Assert
            expect(webSocketServerStub.send).to.have.been.calledOnce;
            expect(webSocketServerStub.close).to.have.been.calledOnce;*/
        });
    });
});
