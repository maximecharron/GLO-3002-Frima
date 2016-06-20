var expect = require("chai").expect;
var Consumable = require("../../domain/items/consumable.js");

var consumableDef = { type: 0, subType: 0, name: "consumable", staminaRegeneration: 2,
    hypeGeneration: 3, effectDuration: 30, quantity: 1 };

var consumable;

describe("Consumable", function ()
{

    beforeEach(function ()
    {
        consumable = new Consumable(consumableDef.type, consumableDef.subType, consumableDef.name, consumableDef.staminaRegeneration,
        consumableDef.hypeGeneration, consumableDef.effectDuration);
    });

    describe("toJson", function()
    {
        it("should return expected Json", function()
        {
            //Arrange
            var expected = consumableDef.toString();

            //Act
            var result = consumable.toJson().toString();

            //Assert
            expect(expected).to.equal(result);
        });
    });

    describe("toString", function()
    {
        it("should return expected string", function()
        {
            //Arrange
            var expected = JSON.stringify(consumableDef);

            //Act
            var result = consumable.toString();

            //Assert
            expect(expected).to.equal(result);
        });
    });
});

