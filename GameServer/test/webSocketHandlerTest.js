/*

TODO: REFACTOR ALL THESE TESTS
var expect = require("chai").expect;
var redis = require('redis').createClient(process.env.REDIS_URL);
var Boss = require("../domain/boss.js").Boss;
var webSocketHandler = require("../handlers/webSocketHandler.js");
var BossModel = require("../models/boss.js").model;
var mongoose = require('mongoose');var websocket;
var hostname = require("os").hostname();
var express = require('express');
var http = require('http');
var ws = require('ws');
var WebSocketServer = require("ws").Server;

var constantBossLife = 100;
var bossStatusUpdate = '{"function":{"name":"bossStatusUpdate","boss":{"bossName":"' +hostname+'","currentBossLife":"100","constantBossLife":"100","status":"ALIVE"}}}'
var defaultBoss = {"bossName": hostname, "currentBossLife": "100", "constantBossLife": "100", "status": "ALIVE"};
var webSocketServer;

//Create server
var app = express();
var port = 8080;
var server = http.createServer(app);
//Connect to mongo
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/frimaGameServer';
mongoose.connect(mongoUri);

before(function (done) {
    mongoose.connection.collections['bosses'].drop( function(err) {
        console.log('collection dropped');
    });
    redis.del(hostname);
    redis.del(hostname+"Constant");
    server.listen(port);
    webSocketServer = new WebSocketServer({server: server});
    webSocketHandler.setWebSocketServer(webSocketServer); // Set le webSocketServer dans le socketHandler
    webSocketServer.on("connection", webSocketHandler.newConnection);
    var defaultBoss = new BossModel({
        bossName: hostname,
        constantBossLife: 100,
        currentBossLife: 100,
        status: "ALIVE"
    });
    defaultBoss.save(function (err){
        webSocketHandler.initializeBoss();
        done();
    })
})
describe("WebSocketHandler tests", function () {

    beforeEach(function (done) {

        websocket = new ws('ws://localhost:8080');
        done();
    });

    describe("WebSocket on connect", function () {

        it("Sends boss status update", function (done) {
            websocket.on('message', function (message) {
                expect(message).to.equal(bossStatusUpdate);
                done();
            })
        })

        it("create default boss", function (done) {
            websocket.on('message', function (message) {
                var boss = JSON.parse(message);
                expect(boss.function.boss.bossName).to.equal(defaultBoss.bossName);
                done();
            })
        })
    });

    beforeEach(function (done) {
        websocket = new ws('ws://localhost:8080');
        done();
    });


    afterEach(function (done) {
        websocket.close();
        done();
    })

})
;

*/
