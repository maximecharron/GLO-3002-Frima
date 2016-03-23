var proxyquire = require('proxyquire');
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);

var expect = chai.expect;
var should = chai.should();
var sinon = require("sinon");
var DbBoss = require('./../../models/boss.js');
var RedisCommunicationService = require('./../../services/redisCommunicationService.js');
var bossConfig = require('./../../config/bossConfig.js');
var Boss = require("./../../domain/boss.js");
var hostname = require('os').hostname();

var dbBossStub = {};

var BossRepository = proxyquire('./../../repository/bossRepository.js', {'./../models/boss.js': dbBossStub});

var redisCommunicationServiceStub
var bossDef = { serverName:hostname, bossName: "Tyson", currentBossLife: "100", maximumBossLife: "100", status: "0" };

//Stubs
dbBossStub.backupBoss = function(boss) {};


before(function(done){
    done();
})

describe("bossRepository", function ()
{
    beforeEach(function(done)
    {
        redisCommunicationServiceStub = sinon.createStubInstance(RedisCommunicationService);
        done();
    })

    describe("saveBoth", function()
    {
        it("should call redisCommunicationService.setBoss & DbBoss.backupBoss", function()
        {
            //Arrange

            var bossRepository = new BossRepository(redisCommunicationServiceStub);
            var redisSpy = chai.spy.on(redisCommunicationServiceStub, 'setBoss');
            var dbBossSpy = chai.spy.on(dbBossStub, "backupBoss");
            //Act
            bossRepository.saveBoth();

            //Assert
            expect(redisSpy).to.have.been.called.once;
            expect(dbBossSpy).to.have.been.called.once;
        });
    });

    describe("saveBossRedis", function()
    {
        it("should call redisCommunicationService.setBoss", function()
        {
            //Arrange
            var redisSpy = chai.spy.on(redisCommunicationServiceStub, 'setBoss');

            var bossRepository = new BossRepository(redisCommunicationServiceStub);
            //Act

            bossRepository.saveBossRedis();

            //Assert
            expect(redisSpy).to.have.been.called.once;
        });
    });

    describe("saveBossBd", function()
    {
        it("should call DbBoss.backupBoss", function()
        {
            //Arrange
            var dbBossSpy = chai.spy.on(dbBossStub, "backupBoss");
            var bossRepository = new BossRepository(redisCommunicationServiceStub);

            //Act

            bossRepository.saveBossToMongo();

            //Assert
            expect(dbBossSpy).to.have.been.called.once;
        });
    });

    describe("getBoss", function()
    {
        it("with boss in redis should only call redisCommunicationService.findBoss once", function(done)
        {
            //Arrange
            var bossExpected = new Boss(bossDef.serverName, bossDef.bossName, bossDef.currentBossLife, bossDef.maximumBossLife, bossDef.status);

            redisCommunicationServiceStub.findBoss.withArgs(hostname).callsArgWith(1, null, bossExpected);
            var redisSpy = chai.spy.on(redisCommunicationServiceStub, 'findBoss');
            var bossRepository = new BossRepository(redisCommunicationServiceStub);

            //Act

            bossRepository.getBoss(function(result)
            {
                //Assert
                expect(redisSpy).to.have.been.called.once;
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

            var redisSpy = chai.spy.on(redisCommunicationServiceStub, 'findBoss');
            var dbBossSpy = chai.spy.on(dbBossStub, "findBoss");
            var bossRepository = new BossRepository(redisCommunicationServiceStub);

            //Act

            bossRepository.getBoss(function(result)
            {
                //Assert
                expect(redisSpy).to.have.been.called.once;
                expect(dbBossSpy).to.have.been.called.once;
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

            var redisSpy = chai.spy.on(redisCommunicationServiceStub, 'findBoss');
            var dbBossSpy = chai.spy.on(dbBossStub, "findBoss");

            var bossRepository = new BossRepository(redisCommunicationServiceStub);

            //Act

            bossRepository.getBoss(function(result)
            {
                //Assert
                expect(redisSpy).to.have.been.called.twice;
                expect(dbBossSpy).to.have.been.called.once;
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

            var redisSpy = chai.spy.on(redisCommunicationServiceStub, 'findBoss');
            var dbBossSpy = chai.spy.on(dbBossStub, "findBoss");

            var bossRepository = new BossRepository(redisCommunicationServiceStub);

            //Act

            bossRepository.getBoss(function(result)
            {
                //Assert
                expect(redisSpy).to.have.been.called.twice;
                expect(dbBossSpy).to.have.been.called.twice;
                expect(bossExpected.toString()).to.equal(result.toString());
                done();
            });
        });

        it("with no boss in redis, mongo and no constant in redis, mongo should get configBoss", function(done)
        {
            //Arrange
            var bossExpected = new Boss(hostname, bossConfig.bossName, bossConfig.currentLife, bossConfig.maximumBossLife, bossConfig.status, new Date().setSeconds(0,0) );
            dbBossStub.findBoss = function(serverName, callBack) {callBack(null);};

            redisCommunicationServiceStub.findBoss.callsArgWith(1, null, null);

            var redisSpy = chai.spy.on(redisCommunicationServiceStub, 'findBoss');
            var dbBossSpy = chai.spy.on(dbBossStub, "findBoss");

            var bossRepository = new BossRepository(redisCommunicationServiceStub);

            //Act

            bossRepository.getBoss(function(result)
            {
                //Assert
                expect(redisSpy).to.have.been.called.twice;
                expect(dbBossSpy).to.have.been.called.twice;
                expect(bossExpected.toString()).to.equal(result.toString());
                done();
            });
        });
    });
});
