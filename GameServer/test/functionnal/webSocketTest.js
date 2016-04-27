require('../../server.js');
var redis = require('redis').createClient(process.env.REDIS_URL);
var GameConfig = require('./../../models/gameConfig.js').model;
var Combo = require('./../../models/combo.js').model;
var expect = require("chai").expect;
var assert = require('chai').assert;
var WebSocket = require('ws');

var webSocketClient;
var onConnectCurrentBossLife;

describe("Functionnal webSocket", function ()
{
    beforeEach(function ()
    {
        webSocketClient = new WebSocket('ws:localhost:4000');
    });

    afterEach(function()
    {
        webSocketClient.close();
    });

    describe('Connect in webSocket', function()
    {
        it('should receive message bossStatusUpdate from server', function(done)
        {
            this.timeout(5000);
            webSocketClient.on("message", function(message)
            {
                //Arrange
                var expectedCommand = "bossStatusUpdate";

                //Act
                var json = JSON.parse(message);

                //Assert
                expect(expectedCommand).to.equal(json.command.name);
                onConnectCurrentBossLife = json.command.parameters.currentBossLife;
                done();
            });
        });
    });

    describe('makeDamage', function()
    {
        it('should receive message bossStatusUpdate lower than the first receive on connect', function(done)
        {
            this.timeout(5000);
            //Arrange
            var jsonAttack =
            {
                token: "token",
                command:
                {
                    name: "attack",
                    parameters:
                    {
                        value: 10
                    }
                }
            };

            //Act
            webSocketClient.onopen = function()
            {
                webSocketClient.send(JSON.stringify(jsonAttack));
            };

            var lowerThan;
            var bossLife;

            webSocketClient.on("message", function(message)
            {
                var json = JSON.parse(message);

                bossLife = json.command.parameters.currentBossLife
                lowerThan = bossLife < onConnectCurrentBossLife;
            });

            //Assert
            setTimeout(function()
            {
                assert.equal(true, lowerThan);
                done();
            }, 1000);

        });
    });

    describe('makeDamage to kill boss', function()
    {
        it('should receive message bossStatusUpdate with status dead', function(done)
        {
            //Arrange
            this.timeout(5000);

            var jsonAttack =
            {
                command:
                {
                    name: "attack",
                    parameters:
                    {
                        value: 100000
                    }
                }
            };

            //Act
            webSocketClient.onopen = function()
            {
                webSocketClient.send(JSON.stringify(jsonAttack));
            };

            var json;

            webSocketClient.on("message", function(message)
            {
                var messageParsed = JSON.parse(message);
                if(messageParsed.command.name == "bossStatusUpdate" && messageParsed.command.parameters.status == 1){
                    json = messageParsed;
                }
            });

            //Assert
            var expectedStatus = 1;
            setTimeout(function()
            {
                assert.equal(expectedStatus, json.command.parameters.status);
                done();
            }, 1000);

        });
    });

    describe('keepAlive', function()
    {
        it('should receive message bossStatusUpdate', function(done)
        {
            this.timeout(5000);
            //Arrange
            var jsonKeepAlive =
            {
                token: "token",
                command:
                {
                    name: "keepAlive"
                }
            };

            //Act
            webSocketClient.onopen = function()
            {
                webSocketClient.send(JSON.stringify(jsonKeepAlive));
            };

            var json;

            webSocketClient.on("message", function(message)
            {
                json = JSON.parse(message);
            });

            //Assert
            var expectedCommand = "bossStatusUpdate";
            setTimeout(function()
            {
                assert.equal(expectedCommand, json.command.name);
                done();
            }, 1000);

        });
    });

    describe('registerClient with no data in database', function()
    {

        var registerClient;

        beforeEach(function (done)
        {

            registerClient =
            {
                "command" : {
                    "name" : "registerClient",
                    "parameters" : {
                        "token" : "aToken"
                    }
                }
            };

            done();
        });

        it('should receive gameConfig', function(done)
        {
            //Arrange
            this.timeout(5000);

            //Act
            webSocketClient.onopen = function()
            {
                webSocketClient.send(JSON.stringify(registerClient));
            };

            var json;
            var expectedCommand = "gameConfigUpdate";

            webSocketClient.on("message", function(message)
            {
                var messageParsed = JSON.parse(message);
                if(messageParsed.command.name == expectedCommand){
                    json = messageParsed;
                }
            });

            //Assert
            setTimeout(function()
            {
                assert.equal(expectedCommand, json.command.name);
                done();
            }, 1000);

        });

        it('should receive comboUpdate', function(done)
        {
            //Arrange
            this.timeout(5000);

            //Act
            webSocketClient.onopen = function()
            {
                webSocketClient.send(JSON.stringify(registerClient));
            };

            var json;
            var expectedCommand = "comboHitSequenceUpdate";

            webSocketClient.on("message", function(message)
            {
                var messageParsed = JSON.parse(message);
                if(messageParsed.command.name == expectedCommand){
                    json = messageParsed;
                }
            });

            //Assert
            setTimeout(function()
            {
                assert.equal(expectedCommand, json.command.name);
                done();
            }, 1000);

        });
    });

    describe('registerClient with data in database', function()
    {
        var registerClient;

        var gameConfigModel;
        var BASE_ATTACK_DAMAGE = 10;
        var BASE_EXPERIENCE_INCREASE_ON_HIT = 10;
        var HYPE_ATTACK_DAMAGE = 1000;
        var MAXIMUM_LEVEL = 13;

        var comboModel;
        var COMBO_NAME = "COMBO!!";
        var TRIGGER_FREQUENCY = 2;
        var BONUS_MULTIPLIER = 4;
        var MAX_FIRST_HIT_WAIT_TIME = 3;
        var MAX_WAIT_TIME_BETWEEN_HITS = 5;

        beforeEach(function(done){
            registerClient =
            {
                "command" : {
                    "name" : "registerClient",
                    "parameters" : {
                        "token" : "aToken"
                    }
                }
            };

            gameConfigModel = new GameConfig();
            gameConfigModel.baseAttackDamage = BASE_ATTACK_DAMAGE;
            gameConfigModel.baseExperienceIncreaseOnHit = BASE_EXPERIENCE_INCREASE_ON_HIT;
            gameConfigModel.hypeAttackDamage = HYPE_ATTACK_DAMAGE;
            gameConfigModel.maximumLevel = MAXIMUM_LEVEL;
            gameConfigModel.save(function (err)
            {
                if (err)
                {
                    console.log("Error to save gameConfig in functionnal test: ", err);
                }
                redis.publish("gameConfigUpdate", "update");

                comboModel = new Combo();
                comboModel.name = COMBO_NAME;
                comboModel.triggerFrequency = TRIGGER_FREQUENCY;
                comboModel.bonusMultiplier = BONUS_MULTIPLIER;
                comboModel.maxFirstHitWaitTime = MAX_FIRST_HIT_WAIT_TIME;
                comboModel.maxWaitTimeBetweenHits = MAX_WAIT_TIME_BETWEEN_HITS;
                comboModel.save(function(err){
                   if(err){
                       console.log("Error to save combo in functionnal test: ", err);
                   }
                    redis.publish("comboUpdate", "update");
                    done();
                });
            });
        });

        afterEach(function(done){
            GameConfig.remove({ }, function (err) {
                if (err){
                    console.log("Problem to Remove gameConfig!: ", err);
                }
                Combo.remove({ }, function (err) {
                    if (err){
                        console.log("Problem to Remove combo!: ", err);
                    }
                    done();
                });
            });
        });

        it('should receive gameConfig with data', function(done)
        {
            //Arrange
            this.timeout(7000);
            setTimeout(function(){ }, 2000);

            //Act
            webSocketClient.onopen = function() {
                webSocketClient.send(JSON.stringify(registerClient));
            };

            var json;
            var expectedCommand = "gameConfigUpdate";

            webSocketClient.on("message", function(message) {
                var messageParsed = JSON.parse(message);
                if(messageParsed.command.name == expectedCommand){
                    json = messageParsed;
                }
            });

            //Assert
            setTimeout(function() {
                assert.equal(expectedCommand, json.command.name);
                assert.equal(BASE_ATTACK_DAMAGE, json.command.parameters.baseAttackDamage);
                assert.equal(HYPE_ATTACK_DAMAGE, json.command.parameters.hypeAttackDamage);
                assert.equal(BASE_EXPERIENCE_INCREASE_ON_HIT, json.command.parameters.baseExperienceIncreaseOnHit);
                assert.equal(MAXIMUM_LEVEL, json.command.parameters.maximumLevel);

                done();
            }, 1000);

        });

        it('should receive combo with data', function(done)
        {
            //Arrange
            this.timeout(7000);
            setTimeout(function(){ }, 2000);

            //Act
            webSocketClient.onopen = function() {
                webSocketClient.send(JSON.stringify(registerClient));
            };

            var json;
            var expectedCommand = "comboHitSequenceUpdate";

            webSocketClient.on("message", function(message) {
                var messageParsed = JSON.parse(message);
                if(messageParsed.command.name == expectedCommand){
                    json = messageParsed;
                }
            });
            //Assert
            setTimeout(function() {
                assert.equal(expectedCommand, json.command.name);
                assert.equal(COMBO_NAME, json.command.parameters.comboHitSequences[0].name);
                assert.equal(TRIGGER_FREQUENCY, json.command.parameters.comboHitSequences[0].triggerFrequency);
                assert.equal(BONUS_MULTIPLIER, json.command.parameters.comboHitSequences[0].bonusMultiplier);
                assert.equal(MAX_FIRST_HIT_WAIT_TIME, json.command.parameters.comboHitSequences[0].maxFirstHitWaitTime);
                assert.equal(MAX_WAIT_TIME_BETWEEN_HITS, json.command.parameters.comboHitSequences[0].maxWaitTimeBetweenHits);

                done();
            }, 1000);

        });

    });

    describe('useItems', function()
    {

        var registerClient;

        beforeEach(function (done)
        {


            done();
        });

        //it('should receive gameConfig', function(done)
        //{
        //    //Arrange
        //    this.timeout(5000);
        //
        //    //Act
        //    webSocketClient.onopen = function()
        //    {
        //        webSocketClient.send(JSON.stringify(registerClient));
        //    };
        //
        //    var json;
        //    var expectedCommand = "gameConfigUpdate";
        //
        //    webSocketClient.on("message", function(message)
        //    {
        //        var messageParsed = JSON.parse(message);
        //        if(messageParsed.command.name == expectedCommand){
        //            json = messageParsed;
        //        }
        //    });
        //
        //    //Assert
        //    setTimeout(function()
        //    {
        //        assert.equal(expectedCommand, json.command.name);
        //        done();
        //    }, 1000);
        //
        //});

    });

});