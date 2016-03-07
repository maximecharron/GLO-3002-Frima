var ws = require('ws');
var wss = require('ws').Server;

var redisSub = require('./../services/redisService.js').redisSub;
redisSub.subscribe("bossDead");

var Boss = require('./../domain/boss.js');
var BossCommunicationService = require('./../services/bossCommunicationService.js');
var BossRepository = require('./../repository/bossRepository.js');

var STATUS = Object.freeze({ALIVE: "0", DEAD: "1"});

var lastLifeBroadcasted = 0;

var theBoss;
var bossRepository = new BossRepository();
var bossCommunicationService = new BossCommunicationService();

setInterval(function () {
        broadcastBossInformation()
    }, 100
);

setInterval(function () {
        bossRepository.saveBossBd(theBoss);
    }, 9000
);

/*
 setInterval ( function (){
 if (theBoss.status == STATUS.DEAD){
 theBoss.revive(function(boss){
 theBoss = boss;
 bossRepository.saveBossBd(theBoss);
 })
 }
 }, 12000)
 */

redisSub.on('message', function (channel, message) {
    console.log("Redis message");
    if (channel == "bossDead") {
        console.log("BroadCast bossDead: ", channel);
        broadcastBossDead();
    }
})

exports.setWebSocketServer = function (webSocketServer) {
    wss = webSocketServer;
}

exports.newConnection = function (webSocket) {
    try {
        webSocket.send(bossCommunicationService.createBossStatusUpdate(theBoss));
    } catch (e) {
        console.log(e);
    }
    webSocket.on("message", function (message) {
        newMessage(message, webSocket);
    });

    webSocket.on("close", function () {
        close(webSocket);
    });
}

function newMessage(message, webSocket) {

    var request = {};
    try {
        var request = JSON.parse(message); //JSON.parse() is synchrone!
    } catch (e) {
        return console.error(e);
    }

    if (request.command.name == "attack") {
        theBoss.receiveDamage(request.command.parameters.number);
    }
    if (request.command.name == "keepAlive") {
        keepAlive(webSocket);
    }
}

function close(webSocket) {
    try {
        webSocket.close();
    } catch (e) {
        console.log(e);
    }

}

function broadcast(data) {
    var message = JSON.stringify(data);
    if (wss.clients) {
        wss.clients.forEach(function each(client) {
            try {
                client.send(message);
            } catch (e) {
                console.log(e);
            }

        });
    }
};

function keepAlive(websocket) {
    var response = bossCommunicationService.createBossStatusUpdate(theBoss);
    try {
        websocket.send(response);
    } catch (e) {
        console.log(e);
    }

}

function broadcastBossInformation() {
    if (theBoss) {
        if (lastLifeBroadcasted != theBoss.getLife() && wss.clients) {
            console.log("inside broadcast BossLife :", theBoss.getLife())
            lastLifeBroadcasted = theBoss.getLife();
            var bossUpdate = bossCommunicationService.createBossStatusUpdate(theBoss);
            wss.clients.forEach(function each(client) {
                try {
                    client.send(bossUpdate);
                } catch (e) {
                    console.log(e);
                }

            });
        }
    }
};

function broadcastBossDead() {
    var bossUpdate = bossCommunicationService.createBossStatusUpdate(theBoss);
    wss.clients.forEach(function each(client) {
        try {
            client.send(bossUpdate);
            client.close();
        } catch (e) {
            console.log(e);
        }
    });

    theBoss.revive();
    bossRepository.saveBossBd(theBoss);
}

exports.initializeBoss = function () {
    bossRepository.getBoss(function (boss) {
        theBoss = boss;
        console.log("theBoss: {0}", theBoss);
        bossRepository.saveBoth(theBoss);
    });

}
