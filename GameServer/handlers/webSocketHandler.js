var ws = require('ws');
var wss = require('ws').Server;
var redis = require('redis').createClient(process.env.REDIS_URL);

var Boss = require('./../domain/boss.js').Boss;
var DbBoss = require('./../models/boss.js');

var STATUS = Object.freeze({ALIVE: "ALIVE", DEAD: "DEAD"});
var theBoss;
var lastLifeBroadcasted = 0;
var lastBossName = "";


setInterval(function () {
        broadcastBossInformation()
    }, 500
);

exports.setWebSocketServer = function (webSocketServer) {
    wss = webSocketServer;
}

exports.newConnection = function (webSocket) {

    webSocket.send(createBossStatusUpdate());

    webSocket.on("message", function (message) {
        newMessage(message, webSocket);
    });

    webSocket.on("close", function () {
        close(webSocket);
    });
}

function newMessage(message, webSocket) {
    var request = JSON.parse(message);

    if (request.function.name == "attack") {
        theBoss.receiveDamage(request.function.number);
    }
    if (request.function.name == "keepAlive") {
        keepAlive(webSocket);
    }
}

function createNewBoss(boss, callback) {
    redis.hmset(boss.bossName, boss);
    theBoss = new Boss(boss.bossName);
    theBoss.initialize(callback);
}

function getRedisConstantBoss(callback) {
    redis.get('constantBossLife', function (error, result) {
        if (error) {
            console.log("Error getting constantBossLife: ", error);
            callback(null);
        }
        if (!result) {
            console.log("constantBossLife from redis is null or empty.");
            callback(null);
        }
        else {
            var bossLife = result;
            console.log("constantBossLife from redis: ", bossLife)
            callback(bossLife);
        }
    });
}

function getConstantBoss(callback) {
    DbBoss.findConstantBoss(function (boss) {
        if (!boss) {
            callback(null);
        }
        else {
            callback(boss);
        }
    })
}

function close(webSocket) {
    webSocket.close();
}

function broadcast(data) {
    var message = JSON.stringify(data);
    if (wss.clients) {
        wss.clients.forEach(function each(client) {
            client.send(message);
        });
    }
};

function keepAlive(websocket) {
    var response = createBossStatusUpdate();
    websocket.send(response);
}

function createBossStatusUpdate() {
    return JSON.stringify({
        function: {
            name: "bossStatusUpdate",
            boss: theBoss.toJson()
        }
    });
}


function broadcastBossInformation() {
    if (theBoss) {
        if (lastLifeBroadcasted != theBoss.getLife() && wss.clients) {
            lastLifeBroadcasted = theBoss.getLife();
            lastBossName = theBoss.getName();
            var bossUpdate = createBossStatusUpdate();
            wss.clients.forEach(function each(client) {
                client.send(bossUpdate);
            });
        }
    }
};

exports.initializeBoss = function (callback) {
    getConstantBoss(function (boss) {
        if (boss){
            createNewBoss(boss, callback);
        }
    })
}

/*
 message from client:
 attack:
 {"function":{"name": "attack","bossName": "Rambo", "number": "10"}}

 new boss:
 {"function":{"name": "newBoss"},"boss":{"bossName": "Rambo","constantBossLife": "100","currentBossLife": "100","status": "ALIVE"}}
 */
