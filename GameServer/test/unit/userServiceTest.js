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

var UserCommunicationService = require('./../../services/userCommunicationService.js');
var UserRepository = require('./../../repository/userRepository.js');
var UserService = require('./../../services/userService.js');

var userCommunicationServiceStub;
var userRepositoryStub;

var experienceInformation;
var webSocketId;
var token;
var items;

before(function(done){
    webSocketId = 2;
    token = "TOKEN";
    experienceInformation = {
        experiencePerLevel : [100,200,300],
        upgradePointsPerLevel : [1,2,3],
        maximumLevel : 2
    };
    items = "ITEM";

    done();
});

describe("userService", function ()
{
    beforeEach(function(done)
    {
        userCommunicationServiceStub = sinon.createStubInstance(UserCommunicationService);
        userRepositoryStub = sinon.createStubInstance(UserRepository);
        done();
    });

    describe("setExperienceInformation", function()
    {
        it("should setExperienceInformation", function()
        {
            //Arrange
            var nextLevel = 1;

            var userService = new UserService(userRepositoryStub, userCommunicationServiceStub);
            var expectedResult = { nextLevelXp: experienceInformation.experiencePerLevel[nextLevel], pointForNextLevel: experienceInformation.upgradePointsPerLevel[nextLevel] };

            //Act
            userService.setExperienceInformation(experienceInformation.experiencePerLevel, experienceInformation.upgradePointsPerLevel, experienceInformation.maximumLevel);
            var result = userService.getInformationNextLevel(nextLevel);

            //Assert
            expect(JSON.stringify(expectedResult)).to.equal(JSON.stringify(result));
        });

    });

    describe("addUserItems", function()
    {
        it("should call userRepository addUserItems", function()
        {
            //Arrange
            var userService = new UserService(userRepositoryStub, userCommunicationServiceStub);
            var userSpy = chai.spy.on(userRepositoryStub, 'addUserItems');
            userService.addUserWebSocket(webSocketId, token);

            //Act
            userService.addUserItems(webSocketId, items);

            //Assert
            expect(userSpy).to.have.been.called.with(token, items);
            expect(userSpy).to.have.been.called.exactly(1);
        });
    });

    describe("updateUserItems", function()
    {
        it("should call userRepository updateUserItems", function()
        {
            //Arrange
            var userService = new UserService(userRepositoryStub, userCommunicationServiceStub);
            var userSpy = chai.spy.on(userRepositoryStub, 'updateUserItems');
            userService.addUserWebSocket(webSocketId, token);

            //Act
            userService.updateUserItems(webSocketId, items);

            //Assert
            expect(userSpy).to.have.been.called.with(token, items);
            expect(userSpy).to.have.been.called.exactly(1);
        });
    });

    describe("levelUpUser", function()
    {
        it("should call userRepository levelUpUser", function()
        {
            //Arrange
            var parameters = {a:1, b:2};
            var levelUpInformation = {c:4, d:5};

            var userService = new UserService(userRepositoryStub, userCommunicationServiceStub);
            var userSpy = chai.spy.on(userRepositoryStub, 'levelUpUser');
            userService.addUserWebSocket(webSocketId, token);

            //Act
            userService.levelUpUser(webSocketId, parameters, levelUpInformation);

            //Assert
            expect(userSpy).to.have.been.called.with(token, parameters, levelUpInformation);
            expect(userSpy).to.have.been.called.exactly(1);
        });
    });

    describe("updateUserExperience", function()
    {
        it("should call userRepository updateUserExperience", function()
        {
            //Arrange
            var experiencePoint = 100;

            var userService = new UserService(userRepositoryStub, userCommunicationServiceStub);
            var userSpy = chai.spy.on(userRepositoryStub, 'updateUserExperience');
            userService.addUserWebSocket(webSocketId, token);

            //Act
            userService.updateUserExperience(webSocketId, experiencePoint);

            //Assert
            expect(userSpy).to.have.been.called.with(token, experiencePoint);
            expect(userSpy).to.have.been.called.exactly(1);
        });
    });
});