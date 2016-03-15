var expect = require("chai").expect;
var redis = require('redis').createClient(process.env.REDIS_URL);
var Boss = require("../domain/boss.js");
var hostname = require('os').hostname();

var bossDef = {serverName:hostname, bossName: "Tyson", constantBossLife: "100", currentBossLife: "100", status: "ALIVE"};
var bossExpected = {bossName: "Tyson", constantBossLife: "100", currentBossLife: "100", status: "ALIVE"};
var boss;
describe("Boss", function () {

    describe("Boss initialize", function () {
        it("initializes the boss", function () {
            boss = new Boss(bossDef.serverName, bossDef.bossName, bossDef.currentBossLife, bossDef.constantBossLife, bossDef.status);
            expect(boss.getLife()).to.equal(bossDef.currentBossLife);
            expect(boss.getName()).to.equal(bossDef.bossName);
            expect(boss.getStatus()).to.equal(bossDef.status);
        })
    });

    beforeEach(function () {
        boss = new Boss(bossDef.serverName, bossDef.bossName, bossDef.currentBossLife, bossDef.constantBossLife, bossDef.status);
    });
    /*
    describe("Boss receive damage", function () {
        it("does damages to the boss", function () {
            var damage = 10;
            boss.receiveDamage(damage);
            var life = boss.getLife();
            expect(life).to.equal(bossDef.constantBossLife - 10);
        });

        it("if boss life lower than 0, no more damage", function () {
            var damage = 100;
            boss.receiveDamage(damage);
            boss.receiveDamage(damage);
            var life = boss.getLife();
            expect(life).to.equal(0);
        });
    });
*/
    describe("Boss stringify", function () {
        it("return expected string", function () {
            var bossString = boss.toString();
            expect(bossString).to.equal(JSON.stringify(bossExpected));
        });
    })
});
