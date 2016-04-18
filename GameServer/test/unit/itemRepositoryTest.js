var proxyquire = require('proxyquire');
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);

var expect = chai.expect;
var should = chai.should();

//Stubs
var itemModelStub = {};

var ItemRepository = proxyquire('./../../repository/itemRepository.js', {'./../models/item.js': itemModelStub});

before(function(done){
    done();
});

describe("itemRepository", function ()
{
    beforeEach(function(done)
    {
        done();
    });

    describe("getItems", function()
    {
        it("should call ItemModel.findItems", function()
        {
            //Arrange
            var itemRepository = new ItemRepository();
            var bdSpy = chai.spy.on(itemModelStub, 'findItems');

            //Act
            itemRepository.getItems();

            //Assert
            expect(bdSpy).to.have.been.called.once;
        });
    });

});
