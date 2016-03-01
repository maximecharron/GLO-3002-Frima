var bossLife;
var async = require('async');
var ws = require('ws');
var wss = require('ws').Server;
var redisPub = require('redis').createClient(process.env.REDIS_URL);
var redisSub = require('redis').createClient(process.env.REDIS_URL);
var redisValuesHandler = require('redis').createClient(process.env.REDIS_URL);
var lastLifeBroadcasted = 0;
var bossLifeHandler = require('./bossLifeHandler.js');

var STATUS = Object.freeze({ALIVE: "ALIVE", DEAD: "DEAD"})

setInterval(function () {
        broadcastBossLifeInformation()
    }, 100
);

bossLifeHandler.getLife(function (result) {
    bossLife = result
});


redisSub.subscribe("boss");
redisSub.subscribe("CMS");
redisSub.on("message", function (channel, message) {
    if (channel == "boss") {
        bossLife = message;
        redisValuesHandler.set("currentBossLife", bossLife);
    }
    if (channel == "CMS") {
        bossLife = message;
        broadcast(bossLife);
    }

});

exports.newConnection = function (webSocket) {

    webSocket.on("message", function (message) {
        newMessage(message, webSocket);
    });

    webSocket.on("close", function () {
        close(webSocket);
    });
}

exports.setWebSocketServer = function (webSocketServer) {
    wss = webSocketServer;
}

function close(webSocket) {
    console.log("webSocket at address ", webSocket._socket.remoteAddress, " is disconnected!"); //TODO: For debug purpose
    webSocket.close();
}

function newMessage(message, webSocket) {
    if (message == "Poke") {
        redisPub.publish("boss", bossLife);
    } else {
        redisPub.publish("boss", bossLife - 1);
    }

}

function broadcastBossLifeInformation() {
    if (bossLife != lastLifeSent){
        sendBossStatusUpdate(STATUS.ALIVE);
    }
}

function broadcast(data) {
    var message = JSON.stringify(data);
    if (wss.clients) {
        wss.clients.forEach(function each(client) {
            client.send(message);
        });
    }
};

function sendBossStatusUpdate(status)
{
    lastLifeBroadcasted = bossLife;
    var message =
    {
        function:
        {
            name: "bossStatusUpdate",
            newBossLife: bossLife,
            status: status
        }
    };
    broadcast(message);
}
