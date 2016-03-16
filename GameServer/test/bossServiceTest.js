var cache = require.cache;
for (var moduleId in cache) {
    delete cache[moduleId];
}

var expect = require('chai').expect;
var sinon = require("sinon");

var BossService = require('./../services/bossService.js');
var BossCommunicationService = require('./../services/bossCommunicationService.js');
var BossRepository = require('./../repository/bossRepository.js');
var Boss = require("../domain/boss.js");
var hostname = require('os').hostname();
var bossDef = { serverName:hostname, bossName: "Tyson", currentBossLife: "100", maximumBossLife: "100", status: "0" };

var bossCommunicationServiceStub;
var bossRepositoryStub;

before(function(done){

    bossCommunicationServiceStub = sinon.stub(BossCommunicationService.prototype);
    bossRepositoryStub = sinon.stub(BossRepository.prototype);
    done();
})

describe("bossService", function ()
{
    describe("initializeBoss", function()
    {
        it("should call bossRepository getBoss and saveBoth", function()
        {
            //Arrange
            var bossExpected = new Boss(bossDef.serverName, bossDef.bossName, bossDef.currentBossLife, bossDef.maximumBossLife, bossDef.status);
            bossRepositoryStub.getBoss.callsArgWith(0, bossExpected);
            var bossService = new BossService(bossCommunicationServiceStub, bossRepositoryStub);

            //Act
            bossService.initializeBoss();

            //Assert
            expect(bossRepositoryStub.getBoss).to.have.been.calledOnce;
            expect(bossRepositoryStub.saveBoth).to.have.been.calledOnce;
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
});
