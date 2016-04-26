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

var UserCommunicationService = require('./../../services/UserCommunicationService.js');

var client;

before(function(done){


    client = {
        _ultron: {id: 1}, send: function (element) {
        }, close: function () {
        }
    };

    done();
});

describe("UserCommunicationService", function () {

    beforeEach(function (done) {
        done();
    });

    describe("sendUserLevelUpInformation", function () {
        it("should call send on client", function () {
            //Arrange
            var levelUpInformation = { pointForNextLevel: 2, nextLevelXp: 1000 };

            var userCommunicationService = new UserCommunicationService();

            var sendSpy = chai.spy.on(client, 'send');

            //Act
            userCommunicationService.sendUserLevelUpInformation(client, levelUpInformation);

            //Assert
            expect(sendSpy).to.have.been.called.exactly(1);
        });
    });
});