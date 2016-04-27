require('../../server.js');
var redis = require('redis').createClient(process.env.REDIS_URL);
var GameConfig = require('./../../models/gameConfig.js').model;
var Combo = require('./../../models/combo.js').model;
var User = require('./../../models/user.js').model;
var Item = require('./../../models/item.js').model;
var expect = require("chai").expect;
var assert = require('chai').assert;
var WebSocket = require('ws');
var jwt = require('jwt-simple');
var moment = require('moment');

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
                var json;
                var expectedCommand = "bossStatusUpdate";

                //Act
                webSocketClient.on("message", function(message)
                {
                    var messageParsed = JSON.parse(message);
                    if(messageParsed != null && messageParsed.command != null && messageParsed.command.name == expectedCommand ){
                        json = messageParsed;
                    }
                });

                //Assert

                setTimeout(function()
                {
                    assert.equal(expectedCommand, json.command.name);
                    onConnectCurrentBossLife = json.command.parameters.currentBossLife;
                    done();
                }, 2000);
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
                        value: 100
                    }
                }
            };

            //Act
            webSocketClient.onopen = function()
            {
                webSocketClient.send(JSON.stringify(jsonAttack));
            };

            var expectedLowerThan = true;
            var lowerThan = false;

            var json;
            var expectedCommand = "bossStatusUpdate";

            webSocketClient.on("message", function(message)
            {
                var messageParsed = JSON.parse(message);
                if(messageParsed != null && messageParsed.command != null && messageParsed.command.name == expectedCommand && messageParsed.command.parameters.currentBossLife < onConnectCurrentBossLife ){
                    json = messageParsed;
                    lowerThan = true;
                }
            });

            //Assert
            setTimeout(function()
            {
                assert.equal(expectedLowerThan, lowerThan);
                done();
            }, 2000);

        });
    });

    describe('makeDamage to kill boss', function()
    {
        var tokenSecret = process.env.TOKEN_SECRET || 'FRIMA_TOKEN_SECRET';
        var user;
        var registerClient;
        var gameConfigModel;
        var item;
        var jsonAttack;

        beforeEach(function (done)
        {
            item = new Item();
            item.type = 0;
            item.subType = 0;
            item.name = "Simple Adrenaline Shot";
            item.quantity = 0;
            item.staminaRegeneration = 0;
            item.hypeGeneration = 2;
            item.effectDuration = 30;

            gameConfigModel = new GameConfig();
            gameConfigModel.baseAttackDamage = 2;
            gameConfigModel.baseExperienceIncreaseOnHit = 2;
            gameConfigModel.hypeAttackDamage = 2222;
            gameConfigModel.maximumLevel = 2;
            gameConfigModel.probabilityLoot = [1,1,1,1];


            user = new User();
            user.id = 123456789;
            user.username = "Test";
            user.email = "test@test.ca";
            user.items = [];

            var expires = moment().add(1, 'days').valueOf();
            user.token = jwt.encode(
                {
                    iss: user.id,
                    exp: expires
                },
                tokenSecret
            );

            registerClient =
            {
                "command" : {
                    "name" : "registerClient",
                    "parameters" : {
                        "token" : user.token
                    }
                }
            };

            jsonAttack =
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

            user.save(function(err){
                if(err){
                    console.log("Error to save user in functionnal test: ", err);
                }
                gameConfigModel.save(function (err) {
                    if (err) {
                        console.log("Error to save gameConfig in functionnal test: ", err);
                    }
                    redis.publish("gameConfigUpdate", "update");
                    item.save(function(err) {
                        if (err) {
                            console.log("Error to save item in functionnal test: ", err);
                        }
                        redis.publish("itemsUpdate", "update");
                        done();
                    });
                });
            });
        });

        afterEach(function(done){
            User.remove({ }, function (err) {
                if (err){
                    console.log("Problem to Remove user!: ", err);
                }
                GameConfig.remove({ }, function (err) {
                    if (err){
                        console.log("Problem to Remove gameConfig!: ", err);
                    }
                    Item.remove({ }, function (err) {
                        if (err){
                            console.log("Problem to Remove item!: ", err);
                        }
                        done();
                    });
                });
            });
        });

        it('should receive message bossStatusUpdate with status dead', function(done)
        {
            //Arrange
            this.timeout(5000);

            //Act
            webSocketClient.onopen = function()
            {
                webSocketClient.send(JSON.stringify(registerClient));
                webSocketClient.send(JSON.stringify(jsonAttack));
            };

            var json;

            webSocketClient.on("message", function(message)
            {
                var messageParsed = JSON.parse(message);
                if(messageParsed != null && messageParsed.command != null && messageParsed.command.name == "bossStatusUpdate" && messageParsed.command.parameters.status == 1){
                    json = messageParsed;
                }
            });

            //Assert
            var expectedStatus = 1;
            setTimeout(function()
            {
                assert.equal(expectedStatus, json.command.parameters.status);
                done();
            }, 2000);

        });

        it('should receive message bossStatusUpdate with status alive', function(done)
        {
            //Arrange
            this.timeout(5000);

            //Act
            webSocketClient.onopen = function()
            {
                webSocketClient.send(JSON.stringify(registerClient));
                webSocketClient.send(JSON.stringify(jsonAttack));
            };

            var json;
            var expectedStatus = 0;
            webSocketClient.on("message", function(message)
            {
                var messageParsed = JSON.parse(message);
                if(messageParsed != null && messageParsed.command != null && messageParsed.command.name == "bossStatusUpdate" && messageParsed.command.parameters.status == expectedStatus){
                    json = messageParsed;
                }
            });

            //Assert

            setTimeout(function()
            {
                assert.equal(expectedStatus, json.command.parameters.status);
                done();
            }, 2000);

        });

        it('should receive message lootItems', function(done)
        {
            //Arrange
            this.timeout(5000);

            //Act
            webSocketClient.onopen = function()
            {
                webSocketClient.send(JSON.stringify(registerClient));
                webSocketClient.send(JSON.stringify(jsonAttack));
            };

            var json;
            var expectedCommand = "lootItems";
            webSocketClient.on("message", function(message)
            {
                var messageParsed = JSON.parse(message);
                if(messageParsed != null && messageParsed.command != null && messageParsed.command.name == expectedCommand ){
                    json = messageParsed;
                }
            });

            //Assert

            setTimeout(function()
            {
                assert.equal(expectedCommand, json.command.name);
                done();
            }, 2000);

        });

        it('should add item in user', function(done)
        {
            //Arrange
            this.timeout(5000);

            //Act
            webSocketClient.onopen = function()
            {
                webSocketClient.send(JSON.stringify(registerClient));
                webSocketClient.send(JSON.stringify(jsonAttack));
            };

            //Assert

            setTimeout(function(){

                var decoded = jwt.decode(user.token, 'FRIMA_TOKEN_SECRET');
                User.findOne({ '_id': decoded.iss }, function (err, updatedUser)
                {
                    if (!err)
                    {
                        if (updatedUser)
                        {

                            //Assert
                            assert.equal(1, updatedUser.items.length);
                            done();
                        }
                    }
                });

            }, 2000);

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
            var expectedCommand = "bossStatusUpdate";
            webSocketClient.on("message", function(message)
            {
                var messageParsed = JSON.parse(message);
                if(messageParsed != null && messageParsed.command != null && messageParsed.command.name == expectedCommand ){
                    json = messageParsed;
                }
            });

            //Assert
            setTimeout(function()
            {
                assert.equal(expectedCommand, json.command.name);
                done();
            }, 2000);

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
                if(messageParsed != null && messageParsed.command != null && messageParsed.command.name == expectedCommand){
                    json = messageParsed;
                }
            });

            //Assert
            setTimeout(function()
            {
                assert.equal(expectedCommand, json.command.name);
                done();
            }, 2000);

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
                if(messageParsed != null && messageParsed.command != null && messageParsed.command.name == expectedCommand){
                    json = messageParsed;
                }
            });

            //Assert
            setTimeout(function()
            {
                assert.equal(expectedCommand, json.command.name);
                done();
            }, 2000);

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
                if(messageParsed != null && messageParsed.command != null && messageParsed.command.name == expectedCommand){
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
            }, 2000);

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
                if(messageParsed != null && messageParsed.command != null && messageParsed.command.name == expectedCommand){
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
            }, 2000);

        });

    });

    describe('useItems', function()
    {
        var tokenSecret = process.env.TOKEN_SECRET || 'FRIMA_TOKEN_SECRET';
        var registerClient;
        var useItems;
        var user;

        beforeEach(function (done)
        {
            useItems = {
                "command":
                {
                    "name": "useItems",
                    "parameters":
                    {
                        "items":[{"type": 0, "subType": 1, "name": "Simple Adrenaline Shot", "quantity": 1}]
                    }
                }
            };

            user = new User();
            user.id = 123456789;
            user.username = "Test";
            user.email = "test@test.ca";
            user.items = [{
                    "type": 0,
                    "subType": 1,
                    "name": "Simple Adrenaline Shot",
                    "quantity": 2,
                    "staminaRegeneration": 0,
                    "hypeGeneration": 2,
                    "effectDuration": 30
            }];
            user.experiencePoints = 100;
            user.upgradePointsOnLevelComplete = 2;
            user.requiredExperiencePointsForNextLevel = 100;
            user.level = 1;
            user.attackPowerLevel = 1;
            user.staminaPowerLevel = 1;
            user.hypePowerLevel = 1;


            var expires = moment().add(1, 'days').valueOf();
            user.token = jwt.encode(
                {
                    iss: user.id,
                    exp: expires
                },
                tokenSecret
            );

            registerClient =
            {
                "command" : {
                    "name" : "registerClient",
                    "parameters" : {
                        "token" : user.token
                    }
                }
            };

            user.save(function(err){
                if(err){
                    console.log("Error to save user in functionnal test: ", err);
                }
                done();
            });

        });

        afterEach(function(done){
            User.remove({ }, function (err) {
                if (err){
                    console.log("Problem to Remove user!: ", err);
                }

               done();
            });
        });

        it('should reduce quantity of the item to 1', function(done)
        {
            //Arrange
            this.timeout(5000);

            //Act
            webSocketClient.onopen = function()
            {
                webSocketClient.send(JSON.stringify(registerClient));
                webSocketClient.send(JSON.stringify(useItems));
            };

            setTimeout(function(){

                var decoded = jwt.decode(user.token, 'FRIMA_TOKEN_SECRET');
                User.findOne({ '_id': decoded.iss }, function (err, updatedUser)
                {
                    if (!err)
                    {
                        if (updatedUser)
                        {

                            //Assert
                            assert.equal(1, updatedUser.items[0].quantity);
                            done();
                        }
                    }
                });

            }, 2000);

        });

    });

    describe('updateUserLevel', function()
    {
        var tokenSecret = process.env.TOKEN_SECRET || 'FRIMA_TOKEN_SECRET';
        var registerClient;
        var updateUserLevel;
        var user;

        var EXPERIENCE_POINTS = 1000;
        var LEVEL = 2;
        var EXPECTED_ATTACK_POWER_LEVEL = 2;
        var EXPECTED_STAMINA_POWER_LEVEL = 2;
        var EXPECTED_HYPE_POWER_LEVEL = 2;

        beforeEach(function (done)
        {
            updateUserLevel = {
                "command":
                {
                    "name": "updateUserLevel",
                    "parameters":
                    {
                        "experiencePoints": EXPERIENCE_POINTS,
                        "level": LEVEL,
                        "attackPowerLevelUpgrade": 1,
                        "staminaPowerLevelUpgrade": 1,
                        "hypePowerLevelUpgrade": 1
                    }
                }
            };

            user = new User();
            user.id = 123456789;
            user.username = "Test";
            user.email = "test@test.ca";
            user.items = [];
            user.experiencePoints = 100;
            user.upgradePointsOnLevelComplete = 2;
            user.requiredExperiencePointsForNextLevel = 100;
            user.level = 1;
            user.attackPowerLevel = 1;
            user.staminaPowerLevel = 1;
            user.hypePowerLevel = 1;


            var expires = moment().add(1, 'days').valueOf();
            user.token = jwt.encode(
                {
                    iss: user.id,
                    exp: expires
                },
                tokenSecret
            );

            registerClient =
            {
                "command" : {
                    "name" : "registerClient",
                    "parameters" : {
                        "token" : user.token
                    }
                }
            };

            user.save(function(err){
                if(err){
                    console.log("Error to save user in functionnal test: ", err);
                }
                done();
            });

        });

        afterEach(function(done){
            User.remove({ }, function (err) {
                if (err){
                    console.log("Problem to Remove user!: ", err);
                }

                done();
            });
        });

        it('should receive userLevelUpInformation', function(done)
        {
            //Arrange
            this.timeout(5000);

            //Act
            webSocketClient.onopen = function()
            {
                webSocketClient.send(JSON.stringify(registerClient));
                webSocketClient.send(JSON.stringify(updateUserLevel));
            };

            var expectedCommand = "userLevelUpInformation";
            var json;

            webSocketClient.on("message", function(message) {
                var messageParsed = JSON.parse(message);
                if(messageParsed != null && messageParsed.command != null && messageParsed.command.name == expectedCommand){
                    json = messageParsed;
                }
            });

            //Assert
            setTimeout(function() {
                assert.equal(expectedCommand, json.command.name);

                done();
            }, 2000);

        });

        it('should update user level and properties', function(done)
        {
            //Arrange
            this.timeout(5000);

            //Act
            webSocketClient.onopen = function()
            {
                webSocketClient.send(JSON.stringify(registerClient));
                webSocketClient.send(JSON.stringify(updateUserLevel));
            };

            setTimeout(function(){

                var decoded = jwt.decode(user.token, 'FRIMA_TOKEN_SECRET');
                User.findOne({ '_id': decoded.iss }, function (err, updatedUser)
                {
                    if (!err)
                    {
                        if (updatedUser)
                        {
                            //Assert
                            assert.equal(EXPERIENCE_POINTS, updatedUser.experiencePoints);
                            assert.equal(LEVEL, updatedUser.level);
                            assert.equal(EXPECTED_ATTACK_POWER_LEVEL, updatedUser.attackPowerLevel);
                            assert.equal(EXPECTED_HYPE_POWER_LEVEL, updatedUser.hypePowerLevel);
                            assert.equal(EXPECTED_STAMINA_POWER_LEVEL, updatedUser.staminaPowerLevel);
                            done();
                        }
                    }
                });

            }, 2000);

        });

    });

    describe('updateUserExperience', function()
    {
        var tokenSecret = process.env.TOKEN_SECRET || 'FRIMA_TOKEN_SECRET';
        var registerClient;
        var updateUserExperience;
        var user;

        var EXPERIENCE_POINTS = 1000;

        beforeEach(function (done)
        {
            updateUserExperience = {
                "command":
                {
                    "name": "updateUserExperience",
                    "parameters":
                    {
                        "experiencePoints": EXPERIENCE_POINTS
                    }
                }
            };

            user = new User();
            user.id = 123456789;
            user.username = "Test";
            user.email = "test@test.ca";
            user.items = [];
            user.experiencePoints = 100;

            var expires = moment().add(1, 'days').valueOf();
            user.token = jwt.encode(
                {
                    iss: user.id,
                    exp: expires
                },
                tokenSecret
            );

            registerClient =
            {
                "command" : {
                    "name" : "registerClient",
                    "parameters" : {
                        "token" : user.token
                    }
                }
            };

            user.save(function(err){
                if(err){
                    console.log("Error to save user in functionnal test: ", err);
                }
                done();
            });

        });

        afterEach(function(done){
            User.remove({ }, function (err) {
                if (err){
                    console.log("Problem to Remove user!: ", err);
                }

                done();
            });
        });

        it('should update user experience', function(done)
        {
            //Arrange
            this.timeout(5000);

            //Act
            webSocketClient.onopen = function()
            {
                webSocketClient.send(JSON.stringify(registerClient));
                webSocketClient.send(JSON.stringify(updateUserExperience));
            };

            setTimeout(function(){

                var decoded = jwt.decode(user.token, 'FRIMA_TOKEN_SECRET');
                User.findOne({ '_id': decoded.iss }, function (err, updatedUser)
                {
                    if (!err)
                    {
                        if (updatedUser)
                        {
                            //Assert
                            assert.equal(EXPERIENCE_POINTS, updatedUser.experiencePoints);
                            done();
                        }
                    }
                });

            }, 2000);

        });

    });

});