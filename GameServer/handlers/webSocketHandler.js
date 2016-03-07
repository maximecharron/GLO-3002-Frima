var ws = require('ws');
var wss = require('ws').Server;

var Boss = require('./../domain/boss.js');
var BossCommunicationService = require('./../services/BossCommunicationService.js');
var BossRepository = require('./../repository/bossRepository.js');

var STATUS = Object.freeze({ALIVE: "ALIVE", DEAD: "DEAD"});

var lastLifeBroadcasted = 0;

var theBoss;
var bossRepository = new BossRepository();
var bossCommunicationService = new BossCommunicationService();

setInterval(function () {
        broadcastBossInformation()
    }, 500
);

setInterval(function () {
        bossRepository.saveBossBd(theBoss);
    }, 10000
);

exports.setWebSocketServer = function(webSocketServer) {
    wss = webSocketServer;
}

exports.newConnection = function(webSocket) {

    webSocket.send(bossCommunicationService.createBossStatusUpdate(theBoss));

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
    var response = bossCommunicationService.createBossStatusUpdate(theBoss);
    websocket.send(response);
}

function broadcastBossInformation() {
    if (theBoss) {
        if (lastLifeBroadcasted != theBoss.getLife() && wss.clients) {
            lastLifeBroadcasted = theBoss.getLife();
            var bossUpdate = bossCommunicationService.createBossStatusUpdate(theBoss);
            wss.clients.forEach(function each(client) {
                client.send(bossUpdate);
            });
        }
    }
};

exports.initializeBoss = function()
{
    bossRepository.getBoss(function(boss)
    {
        theBoss = boss;
        bossRepository.saveBoth(theBoss);
    });

}

/*
 message from client:
 attack:
 {"function":{"name": "attack", "number": "10"}}
 */
