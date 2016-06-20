var cache = require.cache;
for (var moduleId in cache) {
    delete cache[moduleId];
}

var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);

var expect = chai.expect;
var should = chai.should();
var sinon = require("sinon");

var WebSocketServer  = require('ws').Server;
var GameCommunicationService = require('./../../services/gameCommunicationService.js');

var webSocketServerStub;
var gameServiceStub;

var client;

before(function(done){
    webSocketServerStub = sinon.createStubInstance(WebSocketServer);

    client = {
        _ultron: {id: 1}, send: function (element) {
        }, close: function () {
        }
    };

    webSocketServerStub.clients = [client];

    gameServiceStub = {getUserGameConfig:function(){}, getCombos:function(){}};

    done();
});

describe("GameCommunicationService", function () {

    beforeEach(function (done) {
        done();
    });

    describe("sendAllGameInfo", function () {
        it("should sendGameBaseStatUpdate and sendCombo", function () {
            //Arrange
            var gameCommunicationService = new GameCommunicationService(webSocketServerStub, gameServiceStub);

            var sendSpy = chai.spy.on(client, 'send');

            //Act
            gameCommunicationService.sendAllGameInfo(client);

            //Assert
            expect(sendSpy).to.have.been.called.exactly(2);
        });
    });

    describe("broadCastGameConfigUpdate", function () {
        it("should send on clients", function () {
            //Arrange
            var gameCommunicationService = new GameCommunicationService(webSocketServerStub, gameServiceStub);

            var sendSpy = chai.spy.on(client, 'send');

            //Act
            gameCommunicationService.broadCastGameConfigUpdate();

            //Assert
            expect(sendSpy).to.have.been.called.exactly(1);
        });
    });


    describe("broadCastComboUpdate", function () {
        it("should send on clients", function () {
            //Arrange
            var gameCommunicationService = new GameCommunicationService(webSocketServerStub, gameServiceStub);

            var sendSpy = chai.spy.on(client, 'send');

            //Act
            gameCommunicationService.broadCastComboUpdate();

            //Assert
            expect(sendSpy).to.have.been.called.exactly(1);
        });
    });
});