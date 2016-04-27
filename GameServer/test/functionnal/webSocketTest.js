require('../../server.js');
var expect = require("chai").expect;
var assert = require('chai').assert;
var WebSocket = require('ws');

var webSocketClient;

var onConnectCurrentBossLife;

before(function(done){
    setTimeout(function(){done();}, 1000);
});


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

    describe('registerClient', function()
    {

        var registerClient;

        beforeEach(function (done)
        {

            registerClient =
            {
                "command" : {
                    "name" : "registerClient",
                    "parameters" : {
                        "token" : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NzIwMGE0MzM2ZDkyYTAzMDA1Mjk5ODIiLCJleHAiOjE0NjE4MDg0NjUxOTN9.zA8SLIZ0o3VMmNSaxl78TbpHUTseBKSEPKcEfDJHDDE"
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