var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);

var expect = chai.expect;
var should = chai.should();
var sinon = require("sinon");

var WebSocketAPI = require("../api/webSocketAPI.js");
var BossService = require("../services/bossService.js");

describe("Boss", function ()
{
    describe("initializeBoss", function()
    {
        it("should call bossService initializeBoss", function()
        {
            //Arrange
            var bossServiceStub = sinon.createStubInstance(BossService);
            var bossSpy = chai.spy.on(bossServiceStub, 'initializeBoss');


            var webSocketAPI = new WebSocketAPI(bossServiceStub);

            //Act
            webSocketAPI.initializeBoss();

            //Assert
            expect(bossSpy).to.have.been.called.once;
        })
    })
});
