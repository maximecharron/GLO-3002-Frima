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

var LootService = require('./../../services/lootService.js');
var GameService = require('./../../services/gameService.js');
var GameRepository = require('./../../repository/gameRepository.js');
var UserService = require('./../../services/userService.js');

var lootServiceStub;
var gameRepositoryStub;
var userServiceStub;

var gameConfig = {
    probabilityLoot : "1",
    experiencePerLevel : "2",
    upgradePointsPerLevel : "3",
    maximumLevel : "4",
    baseAttackDamage: "1",
    baseExperienceIncreaseOnHit: "2",
    hypeAttackDamage: "3" };

before(function(done){
    done();
});

describe("bossService", function ()
{
    beforeEach(function(done)
    {
        lootServiceStub = sinon.createStubInstance(LootService);
        gameRepositoryStub = sinon.createStubInstance(GameRepository);
        userServiceStub = sinon.createStubInstance(UserService);
        done();
    });

    describe("initializeGameService", function()
    {
        it("should call gameRepository getCombos", function()
        {
            //Arrange
            var gameService = new GameService(gameRepositoryStub, lootServiceStub, userServiceStub);

            var comboSpy = chai.spy.on(gameRepositoryStub, 'getCombos');

            //Act
            gameService.initializeGameService();

            //Assert
            expect(comboSpy).to.have.been.called.exactly(1);
        });

        it("should call gameRepository getGameConfig", function()
        {
            //Arrange
            var gameService = new GameService(gameRepositoryStub, lootServiceStub, userServiceStub);

            var comboSpy = chai.spy.on(gameRepositoryStub, 'getGameConfig');

            //Act
            gameService.initializeGameService();

            //Assert
            expect(comboSpy).to.have.been.called.exactly(1);
        });
    });

    describe("initializeGameBaseStat", function()
    {
        it("should call lootService initializeItemsDropRate", function()
        {
            //Arrange
            gameRepositoryStub.getGameConfig = function(callBack){callBack(gameConfig); };

            var gameService = new GameService(gameRepositoryStub, lootServiceStub, userServiceStub);

            var lootSpy = chai.spy.on(lootServiceStub, 'initializeItemsDropRate');

            //Act
            gameService.initializeGameBaseStat();

            //Assert
            expect(lootSpy).to.have.been.called.with(gameConfig.probabilityLoot);
        });

        it("should call userService setExperienceInformation", function()
        {
            //Arrange
            gameRepositoryStub.getGameConfig = function(callBack){callBack(gameConfig); };

            var gameService = new GameService(gameRepositoryStub, lootServiceStub, userServiceStub);

            var userSpy = chai.spy.on(userServiceStub, 'setExperienceInformation');

            //Act
            gameService.initializeGameBaseStat();

            //Assert
            expect(userSpy).to.have.been.called.with(gameConfig.experiencePerLevel, gameConfig.upgradePointsPerLevel, gameConfig.maximumLevel);
        });

    });

    describe("getUserGameConfig", function()
    {
        it("should return JSON gameUserConfig with correct value", function()
        {
            //Arrange
            gameRepositoryStub.getGameConfig = function(callBack){callBack(gameConfig); };

            var expectedGameUserConfig = {
                baseAttackDamage: gameConfig.baseAttackDamage,
                baseExperienceIncreaseOnHit: gameConfig.baseExperienceIncreaseOnHit,
                hypeAttackDamage: gameConfig.hypeAttackDamage,
                maximumLevel: gameConfig.maximumLevel
            };

            var gameService = new GameService(gameRepositoryStub, lootServiceStub, userServiceStub);

            //Act
            gameService.initializeGameBaseStat();
            var result = gameService.getUserGameConfig();

            //Assert
            expect(JSON.stringify(expectedGameUserConfig)).to.equal(JSON.stringify(result));
        });

    });

});
