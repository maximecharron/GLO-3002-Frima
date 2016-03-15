var proxyquire = require('proxyquire');
var expect = require('chai').expect;
var sinon = require("sinon");
var DbBoss = require('./../models/boss.js');
var RedisCommunicationService = require('./../services/redisCommunicationService.js');

var dbBossStub = sinon.stub(DbBoss);

var BossRepository = proxyquire('../repository/bossRepository.js', {'./../models/boss.js': dbBossStub});

describe("bossRepository", function ()
{

    describe("saveBoth", function()
    {
        it("should call redisCommunicationService.setBoss & DbBoss.backupBoss", function()
        {
            //Arrange
            var redisConnectionServiceStub = sinon.createStubInstance(RedisCommunicationService);
            //dbBossStub = sinon.createStubInstance(DbBoss);

            var bossRepository = new BossRepository(redisConnectionServiceStub);
            //Act

            bossRepository.saveBoth();

            //Assert
            expect(redisConnectionServiceStub.setBoss).to.have.been.calledOnce;
            expect(dbBossStub.backupBoss).to.have.been.calledOnce;
        });
    });
});
