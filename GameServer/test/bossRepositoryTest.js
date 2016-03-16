var proxyquire = require('proxyquire');
var expect = require('chai').expect;
var sinon = require("sinon");
var DbBoss = require('./../models/boss.js');
var RedisCommunicationService = require('./../services/redisCommunicationService.js');
var bossConfig = require('./../config/bossConfig.js');
var Boss = require("../domain/boss.js");
var hostname = require('os').hostname();

var dbBossStub = {};

var BossRepository = proxyquire('./../repository/bossRepository.js', {'./../models/boss.js': dbBossStub});

var dbBossSpy;
var redisCommunicationServiceStub
var bossDef = { serverName:hostname, bossName: "Tyson", currentBossLife: "100", maximumBossLife: "100", status: "0" };

//Stubs
dbBossStub.backupBoss = function(boss) {};


before(function(done){
    redisCommunicationServiceStub = sinon.stub(RedisCommunicationService.prototype);
    dbBossSpy = sinon.spy(dbBossStub, "backupBoss");
    done();
})

describe("bossRepository", function ()
{
    beforeEach(function(done)
    {
        dbBossSpy.reset();
        done();
    })

    describe("saveBoth", function()
    {
        it("should call redisCommunicationService.setBoss & DbBoss.backupBoss", function()
        {
            //Arrange

            var bossRepository = new BossRepository(redisCommunicationServiceStub);

            //Act
            bossRepository.saveBoth();

            //Assert
            expect(redisCommunicationServiceStub.setBoss).to.have.been.calledOnce;
            sinon.assert.calledOnce(dbBossSpy);
        });
    });

    describe("saveBossRedis", function()
    {
        it("should call redisCommunicationService.setBoss", function()
        {
            //Arrange


            var bossRepository = new BossRepository(redisCommunicationServiceStub);
            //Act

            bossRepository.saveBossRedis();

            //Assert
            expect(redisCommunicationServiceStub.setBoss).to.have.been.calledOnce;
            redisCommunicationServiceStub.setBoss.restore();
        });
    });

    describe("saveBossBd", function()
    {
        it("should call DbBoss.backupBoss", function()
        {
            //Arrange

            var bossRepository = new BossRepository(redisCommunicationServiceStub);
            //Act

            bossRepository.saveBossBd();

            //Assert
            sinon.assert.calledOnce(dbBossSpy);
        });
    });

    describe("getBoss", function()
    {
        it("with boss in redis should only call redisCommunicationService.findBoss once", function(done)
        {
            //Arrange
            var bossExpected = new Boss(bossDef.serverName, bossDef.bossName, bossDef.currentBossLife, bossDef.maximumBossLife, bossDef.status);

            redisCommunicationServiceStub.findBoss.withArgs(hostname).callsArgWith(1, null, bossExpected);

            var bossRepository = new BossRepository(redisCommunicationServiceStub);

            //Act

            bossRepository.getBoss(function(result)
            {
                //Assert
                expect(redisCommunicationServiceStub.findBoss).to.have.been.calledOnce;
                expect(bossExpected.toString()).to.equal(result.toString());
                done();
            });
        });

        it("with boss in mongo should only call DbBoss.findBoss once", function(done)
        {
            //Arrange
            var bossExpected = new Boss(bossDef.serverName, bossDef.bossName, bossDef.currentBossLife, bossDef.maximumBossLife, bossDef.status);
            dbBossStub.findBoss = function(serverName, callBack){ callBack(bossExpected)};

            redisCommunicationServiceStub.findBoss.withArgs(hostname).callsArgWith(1, null, null);

            var bossRepository = new BossRepository(redisCommunicationServiceStub);

            //Act

            bossRepository.getBoss(function(result)
            {
                //Assert
                expect(redisCommunicationServiceStub.findBoss).to.have.been.calledOnce;
                expect(dbBossStub.findBoss).to.have.been.calledOnce;
                expect(bossExpected.toString()).to.equal(result.toString());
                done();
            });
        });

        it("with no boss in redis and mongo should get redis constantBoss", function(done)
        {
            //Arrange
            var bossExpected = new Boss(bossDef.serverName, bossDef.bossName, bossDef.currentBossLife, bossDef.maximumBossLife, bossDef.status);
            dbBossStub.findBoss = function(serverName, callBack){ callBack(null)};

            redisCommunicationServiceStub.findBoss.withArgs(hostname).callsArgWith(1, null, null);
            redisCommunicationServiceStub.findBoss.withArgs(hostname + "Constant").callsArgWith(1, null, bossExpected);

            var bossRepository = new BossRepository(redisCommunicationServiceStub);

            //Act

            bossRepository.getBoss(function(result)
            {
                //Assert
                expect(redisCommunicationServiceStub.findBoss).to.have.been.calledTwice;
                expect(dbBossStub.findBoss).to.have.been.calledOnce;
                expect(bossExpected.toString()).to.equal(result.toString());
                done();
            });
        });

        it("with no boss in redis, mongo and no constant in redis should get mongo constantBoss", function(done)
        {
            //Arrange
            var bossExpected = new Boss(bossDef.serverName, bossDef.bossName, bossDef.currentBossLife, bossDef.maximumBossLife, bossDef.status);
            dbBossStub.findBoss = function(serverName, callBack)
            {
                if(serverName == hostname)
                {
                    callBack(null);
                }
                else {
                    callBack(bossExpected);
                }
            };

            redisCommunicationServiceStub.findBoss.withArgs(hostname).callsArgWith(1, null, null);
            redisCommunicationServiceStub.findBoss.withArgs(hostname + "Constant").callsArgWith(1, null, null);

            var bossRepository = new BossRepository(redisCommunicationServiceStub);

            //Act

            bossRepository.getBoss(function(result)
            {
                //Assert
                expect(redisCommunicationServiceStub.findBoss).to.have.been.calledTwice;
                expect(dbBossStub.findBoss).to.have.been.calledTwice;
                expect(bossExpected.toString()).to.equal(result.toString());
                done();
            });
        });

        it("with no boss in redis, mongo and no constant in redis, mongo should get configBoss", function(done)
        {
            //Arrange
            var bossExpected = new Boss(hostname, bossConfig.bossName, bossConfig.currentLife, bossConfig.maximumBossLife, bossConfig.status );
            dbBossStub.findBoss = function(serverName, callBack) {callBack(null);};

            redisCommunicationServiceStub.findBoss.callsArgWith(1, null, null);

            var bossRepository = new BossRepository(redisCommunicationServiceStub);

            //Act

            bossRepository.getBoss(function(result)
            {
                //Assert
                expect(redisCommunicationServiceStub.findBoss).to.have.been.calledTwice;
                expect(dbBossStub.findBoss).to.have.been.calledTwice;
                expect(bossExpected.toString()).to.equal(result.toString());
                done();
            });
        });
    });
});
