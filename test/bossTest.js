var expect = require("chai").expect;
var redis = require('redis').createClient(process.env.REDIS_URL);
var Boss = require("../boss.js").Boss;

var bossDef = {bossName: "Rambo", constantBossLife: "100", currentBossLife: "100", status: "ALIVE"};
var boss;
describe("Boss", function () {

    describe("Boss initialize", function () {
        it("does damages to the boss", function () {
            redis.hmset(bossDef.bossName, bossDef);
            boss = new Boss(bossDef.bossName);
            boss.initialize(function () {
                expect(boss.getLife()).to.equal(bossDef.currentBossLife);
                expect(boss.getName()).to.equal(bossDef.bossName);
                expect(boss.getStatus()).to.equal(bossDef.status);
            });
        })
    });

    beforeEach(function (done) {
        redis.hmset(bossDef.bossName, bossDef);
        boss = new Boss(bossDef.bossName);
        boss.initialize(function () {
            done();
        });
    });

    describe("Boss receive damage", function () {
        it("does damages to the boss", function () {
            var damage = 10;
            boss.receiveDamage(damage);
            var life = boss.getLife();
            expect(life).to.equal(bossDef.constantBossLife - 10);
        })
    });

    describe("Boss receive damage until 0", function () {
        it("if boss life lower than 0, no more damage", function () {
            var damage = 100;
            boss.receiveDamage(damage);
            boss.receiveDamage(damage);
            var life = boss.getLife();
            expect(life).to.equal(0);
        });
    });

    describe("Boss stringify", function () {
        it("return expected string", function () {
            var bossString = boss.toString();
            expect(bossString).to.equal('{"bossName":"Rambo","constantBossLife":"100","currentBossLife":"100","status":"ALIVE"}');
        });
    })
});

