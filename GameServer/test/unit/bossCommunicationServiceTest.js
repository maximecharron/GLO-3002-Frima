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

var BossCommunicationService = require('./../../services/bossCommunicationService.js');

var webSocketServerStub;
var lootServiceStub;
var userServiceStub;

before(function(done){
    webSocketServerStub = sinon.createStubInstance(WebSocketServer);
    lootServiceStub = {createItemsCommand:function(){}, getLoot:function(){}};
    userServiceStub = {addUserItems:function(a,b){}};
    done();
})

describe("bossCommunicationService", function () {
    beforeEach(function (done) {
        done();
    })
    describe("createBossStatusUpdate", function () {
        it("should return bossStatusUpdateString", function () {
            //Arrange
            var bossStub = {
                toJson: function () {
                }
            };
            var expectedString = JSON.stringify({command: {name: "bossStatusUpdate", parameters: bossStub.toJson}})

            var bossCommunicationService = new BossCommunicationService(webSocketServerStub, lootServiceStub);

            //Act
            var result = bossCommunicationService.createBossStatusUpdate(bossStub);

            //Assert
            expect(expectedString).to.equal(result);
        });
    });

    describe("broadcastBossDead", function () {
        it("should call send on clients", function () {
            //Arrange
            var bossStub = {
                toJson: function () {
                }
            };
            var client = {
                _ultron: {id: 1}, send: function (bossUpdate) {
                }, close: function () {
                }
            };
            webSocketServerStub.clients = [client];

            var bossCommunicationService = new BossCommunicationService(webSocketServerStub, lootServiceStub, userServiceStub);
            var sendSpy = chai.spy.on(client, 'send');

            //Act
            bossCommunicationService.broadcastBossDead(bossStub);

            //Assert
            expect(sendSpy).to.have.been.called.exactly(2);
        });
    });

    describe("broadcastBossDead", function () {
        it("with error should log", function () {
            //Arrange
            var bossStub = {
                toJson: function () {
                }
            };
            var client = {
                _ultron: {id: 1}, send: function (bossUpdate) {  throw "error";
                }, close: function () {
                }
            };
            webSocketServerStub.clients = [client];

            lootServiceStub = {
                createItemsCommand: function () {
                }, getLoot: function () {
                }
            };
            var bossCommunicationService = new BossCommunicationService(webSocketServerStub, lootServiceStub, userServiceStub);
            var sendSpy = chai.spy.on(client, 'send');

            //Act
            bossCommunicationService.broadcastBossDead(bossStub);

            //Assert
            expect(sendSpy).to.have.been.called.once;

        });
    });

    describe("broadcastBossInformation", function () {
        it("should call send on clients", function () {
            //Arrange
            var bossStub = {
                toJson: function () {
                }, getLife: function () {
                    return 10
                }
            };
            var client = {
                send: function (bossUpdate) {
                }, close: function () {
                }
            };
            webSocketServerStub.clients = [client];
            var sendSpy = chai.spy.on(client, 'send');
            var bossCommunicationService = new BossCommunicationService(webSocketServerStub, lootServiceStub);

            //Act
            bossCommunicationService.broadcastBossInformation(bossStub);

            //Assert
            expect(sendSpy).to.have.been.called.once;
        });
    });

    describe("broadcastBossInformation", function () {
        it(" with error should log", function () {
            //Arrange
            var bossStub = {
                toJson: function () {
                }, getLife: function () {
                    return 10
                }
            };
            var client = {
                send: function (bossUpdate) {
                    throw "error"
                }, close: function () {
                }
            };
            webSocketServerStub.clients = [client];
            var sendSpy = chai.spy.on(client, 'send');
            var bossCommunicationService = new BossCommunicationService(webSocketServerStub, lootServiceStub);

            //Act
            bossCommunicationService.broadcastBossInformation(bossStub);

            //Assert
            expect(sendSpy).to.have.been.called.once;
        });
    });

    describe("broadcastBossInformation", function () {
        it("with boss null should not call send", function () {
            //Arrange
            var bossStub = null;
            var client = {
                send: function (bossUpdate) {
                }, close: function () {
                }
            };
            webSocketServerStub.clients = [client];
            var sendSpy = chai.spy.on(client, 'send');
            var bossCommunicationService = new BossCommunicationService(webSocketServerStub, lootServiceStub);

            //Act
            bossCommunicationService.broadcastBossInformation(bossStub);

            //Assert
            expect(sendSpy).to.have.been.called.exactly(0);
        });
    });

    describe("broadcastBossInformation", function () {
        it("with bossLif didnt change should not call send the second time", function () {
            //Arrange
            var bossStub = {
                toJson: function () {
                }, getLife: function () {
                    return 10
                }
            };
            var client = {
                send: function (bossUpdate) {
                }, close: function () {
                }
            };
            webSocketServerStub.clients = [client];
            var sendSpy = chai.spy.on(client, 'send');
            var bossCommunicationService = new BossCommunicationService(webSocketServerStub, lootServiceStub);

            //Act
            bossCommunicationService.broadcastBossInformation(bossStub);
            bossCommunicationService.broadcastBossInformation(bossStub);

            //Assert
            expect(sendSpy).to.have.been.called.exactly(1);
        });
    });

    describe("keepAlive", function () {
        it("should call send on websocket", function () {
            //Arrange
            var bossStub = {
                toJson: function () {
                }, getLife: function () {
                    return 10
                }
            };
            var webSocket = {
                send: function (bossUpdate) {
                }, close: function () {
                }
            };
            var sendSpy = chai.spy.on(webSocket, 'send');
            var bossCommunicationService = new BossCommunicationService(webSocketServerStub, lootServiceStub);

            //Act
            bossCommunicationService.keepAlive(bossStub, webSocket);

            //Assert
            expect(sendSpy).to.have.been.called.once;
        });
    });
});