var expect = require("chai").expect;
var LootService = require("../../services/lootService.js");


describe("LootService", function ()
{

    beforeEach(function ()
    {

    });

    describe("initializeItems", function()
    {
        it("should push a list of items in the items array", function()
        {
            //Act
            var lootService = new LootService();

            //Assert
            expect(lootService.items.length).to.not.equal(0);
        });
    });



    describe("getLoot", function()
    {
        it("should return a random element in the items array", function()
        {
            //Arrange
            var lootService = new LootService();

            //Act
            var item = lootService.getLoot();
            //console.log(item);

            //Assert
            expect(lootService.items).to.contain(item)
        });
    });
});