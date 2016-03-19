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

var BossService = require('./../../services/bossService.js');
var BossCommunicationService = require('./../../services/bossCommunicationService.js');
var BossRepository = require('./../../repository/bossRepository.js');
var Boss = require("../../domain/boss.js");
var hostname = require('os').hostname();
var bossDef = { serverName:hostname, bossName: "Tyson", currentBossLife: "100", maximumBossLife: "100", status: "0" };

var bossCommunicationServiceStub;
var bossRepositoryStub;

before(function(done){
    done();
})

describe("bossService", function ()
{
    beforeEach(function(done)
    {
        bossCommunicationServiceStub = sinon.createStubInstance(BossCommunicationService);
        bossRepositoryStub = sinon.createStubInstance(BossRepository);
        done();
    })
    describe("initializeBoss", function()
    {
        it("should call bossRepository getBoss and saveBoth", function()
        {
            //Arrange
            var bossExpected = new Boss(bossDef.serverName, bossDef.bossName, bossDef.currentBossLife, bossDef.maximumBossLife, bossDef.status);
            bossRepositoryStub.getBoss.callsArgWith(0, bossExpected);
            var bossService = new BossService(bossCommunicationServiceStub, bossRepositoryStub);
            var getSpy = chai.spy.on(bossRepositoryStub, 'getBoss');
            var saveSpy = chai.spy.on(bossRepositoryStub, 'saveBoth');
            //Act
            bossService.initializeBoss();

            //Assert
            expect(getSpy).to.have.been.called.once;
            expect(saveSpy).to.have.been.called.once;
        });
    });

    describe("makeDamage", function()
    {
        it("should call reduce bossLife", function()
        {
            //Arrange
            var bossExpected = new Boss(bossDef.serverName, bossDef.bossName, bossDef.currentBossLife, bossDef.maximumBossLife, bossDef.status);
            bossRepositoryStub.getBoss.callsArgWith(0, bossExpected);
            var bossService = new BossService(bossCommunicationServiceStub, bossRepositoryStub);
            var damageToReceive = 10;

            var expectLife = 90;
            var resultLife = 0;

            var callback = function(theBoss)
            {
                resultLife = theBoss.getLife();
            };

            //Act
            bossService.initializeBoss();
            bossService.makeDamage(damageToReceive, callback);

            //Assert
            expect(expectLife).to.equal(resultLife);
        });
    });

    describe("reviveBoss", function()
    {
        it("should reviveBoss with sameLife after damage", function()
        {
            //Arrange
            var bossExpected = new Boss(bossDef.serverName, bossDef.bossName, bossDef.currentBossLife, bossDef.maximumBossLife, bossDef.status);
            bossRepositoryStub.getBoss.callsArgWith(0, bossExpected);
            var bossService = new BossService(bossCommunicationServiceStub, bossRepositoryStub);
            var damageToReceive = 10;

            //Act
            bossService.initializeBoss();
            bossService.makeDamage(damageToReceive, function(theBoss){});
            bossService.reviveBoss();
            var resultBoss = bossService.getCurrentBoss();

            //Assert
            expect(bossExpected.toString()).to.equal(resultBoss.toString());

        });
    });

    describe("updateBoss", function()
    {
        it("should update current and maximum life", function()
        {
            //Arrange
            var bossExpected = new Boss(bossDef.serverName, bossDef.bossName, bossDef.currentBossLife, bossDef.maximumBossLife, bossDef.status);
            bossRepositoryStub.getBoss.callsArgWith(0, bossExpected);
            var bossService = new BossService(bossCommunicationServiceStub, bossRepositoryStub);

            var expectedCurrentLife = 5000;
            var expectedMaximumLife = 6666;

            //Act
            bossService.initializeBoss();
            bossService.updateBoss(expectedCurrentLife, expectedMaximumLife);

            var resultBoss = bossService.getCurrentBoss();

            //Assert
            expect(expectedCurrentLife).to.equal(resultBoss.getLife());
            expect(expectedMaximumLife).to.equal(resultBoss.getMaximumLife());
        });
    });

    describe("saveBossToDataBase", function()
    {
        it("should call bossRepository saveBossToMongo", function()
        {
            //Arrange
            var bossExpected = new Boss(bossDef.serverName, bossDef.bossName, bossDef.currentBossLife, bossDef.maximumBossLife, bossDef.status);
            bossRepositoryStub.getBoss.callsArgWith(0, bossExpected);
            var bossService = new BossService(bossCommunicationServiceStub, bossRepositoryStub);
            var saveSpy = chai.spy.on(bossRepositoryStub, 'saveBossToMongo');

            //Act
            bossService.saveBossDataBase();

            //Assert
            expect(saveSpy).to.have.been.called.once;
        });
    });
});
