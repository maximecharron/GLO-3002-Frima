var expect = require("chai").expect;
var Boss = require("../domain/boss.js");
require("./../constants/bossConstants.js");
var hostname = require('os').hostname();

var bossDef = { serverName:hostname, bossName: "Tyson", currentBossLife: "100", maximumBossLife: "100", status: "0" };
var bossExpected = { bossName: "Tyson", currentBossLife: "100", maximumBossLife: "100", status: "0" };
var boss;

describe("Boss", function ()
{

    beforeEach(function ()
    {
        boss = new Boss(bossDef.serverName, bossDef.bossName, bossDef.currentBossLife, bossDef.maximumBossLife, bossDef.status);
        boss.revive();
    });

    describe("toJson", function()
    {
        it("should return expected Json", function()
        {
            //Arrange
            var expected = bossExpected.toString();

            //Act
            var result = boss.toJson().toString();

            //Assert
            expect(expected).to.equal(result);
        });
    });

    describe("toString", function ()
    {
        it("should return expected string", function ()
        {
            //Arrange
            var expected = JSON.stringify(bossExpected);

            //Act
            var result = boss.toString();

            //Assert
            expect(expected).to.equal(result);
        });
    });

    describe("receiveDamage with bossLife > 0", function()
    {
        it("should return bossLife less life and status alive", function()
        {
            //Arrange
            var expectedBossLife = 90;
            var expectedStatus = STATUS.ALIVE;

            //Act
            boss.receiveDamage(10);
            var resultLife = boss.getLife();
            var resultStatus = boss.getStatus();

            //Assert
            expect(expectedBossLife).to.equal(resultLife);
            expect(expectedStatus).to.equal(resultStatus);
        });
    });

    describe("receiveDamage with bossLife < 0", function()
    {
        it("should return bossLife 0 and status dead", function()
        {
            //Arrange
            var expectedBossLife = 0;
            var expectedStatus = STATUS.DEAD;

            //Act
            boss.receiveDamage(110);
            var resultLife = boss.getLife();
            var resultStatus = boss.getStatus();

            //Assert
            expect(expectedBossLife).to.equal(resultLife);
            expect(expectedStatus).to.equal(resultStatus);
        });
    });

    describe("receiveDamage with bossLife = 0", function()
    {
        it("should return bossLife 0 and status dead", function()
        {
            //Arrange
            var expectedBossLife = 0;
            var expectedStatus = STATUS.DEAD;

            //Act
            boss.receiveDamage(100);

            var resultLife = boss.getLife();
            var resultStatus = boss.getStatus();

            //Assert
            expect(expectedBossLife).to.equal(resultLife);
            expect(expectedStatus).to.equal(resultStatus);
        });
    });

    describe("revive", function()
    {
        it("should return boss with currentBossLife == maximumBossLife and status alive", function()
        {
            //Arrange
            var expectedBossLife = boss.getMaximumLife();
            var expectedStatus = STATUS.ALIVE;
            //Act
            boss.receiveDamage(100);
            boss.revive();
            var resultLife = boss.getLife();
            var resultStatus = boss.getStatus();

            //Assert
            expect(expectedBossLife).to.equal(resultLife);
            expect(expectedStatus).to.equal(resultStatus);
        });
    });

    describe("setMaximumLife", function()
    {
        it("should return maximumBossLife equal to life", function()
        {
            //Arrange
            var expectedBossLife = 1000;

            //Act
            boss.setMaximumLife(expectedBossLife);
            var resultLife = boss.getMaximumLife();

            //Assert
            expect(expectedBossLife).to.equal(resultLife);
        });
    });

    describe("setCurrentLife", function()
    {
        it("should return currentBossLife equal to life", function()
        {
            //Arrange
            var expectedBossLife = 50;

            //Act
            boss.setCurrentLife(expectedBossLife);
            var resultLife = boss.getLife();

            //Assert
            expect(expectedBossLife).to.equal(resultLife);
        });
    });

});
