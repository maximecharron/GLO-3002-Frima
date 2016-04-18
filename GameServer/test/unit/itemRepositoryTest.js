var proxyquire = require('proxyquire');
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);

var expect = chai.expect;
var should = chai.should();
var sinon = require("sinon");
var itemModel = require('./../../models/item.js');

var itemModelStub = {};
var ItemRepository = proxyquire('./../../repository/bossRepository.js', {'./../models/item.js': itemModelStub});
var item;

//Stubs


before(function(done){
    done();
});

describe("bossRepository", function ()
{
    beforeEach(function(done)
    {
        //boss = new Boss(bossDef.serverName, bossDef.bossName, bossDef.currentBossLife, bossDef.maximumBossLife, bossDef.status);
        //redisCommunicationServiceStub = sinon.createStubInstance(RedisCommunicationService);
        done();
    });

    describe("getItems", function()
    {
        it("should call ItemModel.findItems", function()
        {
            //Arrange
            //var bossRepository = new BossRepository(redisCommunicationServiceStub);
            //var redisSpy = chai.spy.on(redisCommunicationServiceStub, 'setBoss');

            //Act
            //bossRepository.saveBoth(boss);

            //Assert
            //expect(redisSpy).to.have.been.called.once;
        });
    });

});
