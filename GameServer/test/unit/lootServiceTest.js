var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);

var expect = chai.expect;
var should = chai.should();
var sinon = require("sinon");

var LootService = require("../../services/lootService.js");
var ItemRepository = require("../../repository/itemRepository.js");

var itemRepositoryStub;

var items;

before(function(done){
    done();
});

describe("LootService", function ()
{

    beforeEach(function(done)
    {
        items = ["1"];
        itemRepositoryStub = sinon.createStubInstance(ItemRepository);
        itemRepositoryStub.getItems = function(callBack){callBack(items); };
        done();
    });

    describe("initializeItems", function()
    {
        it("should call itemRepository and initialize items", function()
        {
            //Arrange
            var repositorySpy = chai.spy.on(itemRepositoryStub, 'getItems');

            //Act
            var lootService = new LootService(itemRepositoryStub);

            //Assert
            expect(repositorySpy).to.have.been.called.exactly(1);
            expect(lootService.items.length).to.equal(items.length);
        });
    });

    describe("getLoot", function()
    {
        it("should return a random element", function()
        {
            //Arrange
            var lootService = new LootService(itemRepositoryStub);
            items = ["1","2"];

            //Act
            lootService.initializeItemsDropRate([1,1,1,2,2]);
            var item = lootService.getLoot();

            //Assert
            expect(items).to.contain.any.keys(item)
        });
    });
});