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
    }, 500
);

setInterval(function () {
        bossRepository.saveBossBd(theBoss);
    }, 9000
);

setInterval ( function (){
   if (theBoss.status == STATUS.DEAD){
       theBoss.revive(function(boss){
           theBoss = boss;
           bossRepository.saveBossBd(theBoss);
       })
   }
}, 12000)

redisSub.on('message', function(channel, message){
    if(channel == "bossDead")
    {
        console.log("BroadCast bossDead: ", channel);
        broadcastBossDead();
    } else if (channel == theBoss.serverName){
        try {
            var bossMessage = JSON.parse(message); //JSON.parse() is synchrone!
        } catch (e) {
            return console.error(e);
        }
        theBoss.currentBossLife = bossMessage.currentBossLife;
        theBoss.constantBossLife = bossMessage.constantBossLife;
    }
})

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
        if (lastLifeBroadcasted != theBoss.getLife() && wss.clients)
        {
            console.log("inside broadcast BossLife :", theBoss.getLife())
            lastLifeBroadcasted = theBoss.getLife();
            var bossUpdate = bossCommunicationService.createBossStatusUpdate(theBoss);
            wss.clients.forEach(function each(client)
            {
                client.send(bossUpdate);
            });
        }
    }
};

function broadcastBossDead(){
    var bossUpdate = bossCommunicationService.createBossStatusUpdate(theBoss);
    wss.clients.forEach(function each(client) {
        client.send(bossUpdate);
        client.close();
    });


}

exports.initializeBoss = function()
{
    bossRepository.getBoss(function(boss)
    {
        theBoss = boss;
        console.log("theBoss: {0}", theBoss);
        bossRepository.saveBoth(theBoss);
    });

}
