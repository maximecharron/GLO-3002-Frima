var ws = require('ws');
var wss = require('ws').Server;
var redis = require('redis').createClient(process.env.REDIS_URL);

var Boss = require('./../domain/boss.js').Boss;
var DbBoss = require('./../models/boss.js');

var STATUS = Object.freeze({ALIVE: "ALIVE", DEAD: "DEAD"});
var allBoss = {};
var theBoss;
var lastLifeBroadcasted = 0;


setInterval(function () {
        broadcastBossInformation()
    }, 100
);

exports.setWebSocketServer = function (webSocketServer) {
    wss = webSocketServer;
}

exports.newConnection = function (webSocket) {

    if (!theBoss) {
        createConstantBoss(function (boss) {
            theBoss = boss;
        })
    } else {
        webSocket.send(createBossStatusUpdate());
    }

    webSocket.on("message", function (message) {
        newMessage(message, webSocket);
    });

    webSocket.on("close", function () {
        close(webSocket);
    });
}

function newMessage(message, webSocket) {
    var request = JSON.parse(message);

    if (request.function.name == "newBoss") {
        createNewBoss(request);
    }
    if (request.function.name == "attack") {
        if (theBoss == undefined) {
            theBoss = new Boss(request.function.bossName);
            theBoss.initialize();
        }
        theBoss.receiveDamage(request.function.number);
    }
    if (request.function.name == "keepAlive") {
        keepAlive(webSocket);
    }
}

function createNewBoss(request) {
    redis.hmset(request.boss.bossName, request.boss);
    theBoss = new Boss(request.boss.bossName);
    theBoss.initialize(function (err, data) {
        if (!err) {
            allBoss[request.boss.bossName] = theBoss.toJson();
            console.log("Boss parse :", allBoss[request.boss.bossName]);
        }
    });
}

function createConstantBoss(request) {
    getRedisConstantBoss(function (constantLife) {
        if (!constantLife) {
            getMongoConstantBoss(function (constantLife) {

            })
        } else {
            var request = {
                "function": {"name": "newBoss"},
                "boss": {
                    "bossName": "DefaultBoss",
                    "constantBossLife": constantLife,
                    "currentBossLife": constantLife,
                    "status": "ALIVE"
                }
            }
            createNewBoss(request);
        }
    })
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

function getMongoConstantBoss(callback) {
    DbBoss.findConstantBoss(function(constantLife){
        if (!constantLife) {
            console.log("currentBossLife is null or empty.");
            callback(null);
        }
        else {
            var bossLife = constantLife;
            console.log("currentBossLife from Mongo: ", bossLife)
            callback(bossLife);
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
    if (theBoss != undefined) {
        if (lastLifeBroadcasted != theBoss.getLife() && wss.clients) {
            lastLifeBroadcasted = theBoss.getLife();
            wss.clients.forEach(function each(client) {
                client.send(createBossStatusUpdate());
            });
        }
    }
};

/*
 message from client:
 attack:
 {"function":{"name": "attack","bossName": "Rambo", "number": "10"}}

 new boss:
 {"function":{"name": "newBoss"},"boss":{"bossName": "Rambo","constantBossLife": "100","currentBossLife": "100","status": "ALIVE"}}
 */
