var expect = require("chai").expect;
var sinon = require("sinon");

var WebSocketAPI = require("../api/webSocketAPI.js");
var BossService = require("../services/bossService.js");
var BossCommunicationService = require("../services/bossCommunicationService.js");
var RedisCommunicationService = require("../services/redisCommunicationService.js");
var WebSocketServer = require("ws").Server;

describe("Boss", function ()
{
    describe("initializeBoss", function()
    {
        it("should call bossService initializeBoss", function()
        {
            //Arrange
            var bossServiceStub = sinon.createStubInstance(BossService);

            var webSocketAPI = new WebSocketAPI(bossServiceStub);

            //Act
            webSocketAPI.initializeBoss();

            //Assert
            expect(bossServiceStub.initializeBoss).to.have.been.calledOnce;
        })
    })
});
