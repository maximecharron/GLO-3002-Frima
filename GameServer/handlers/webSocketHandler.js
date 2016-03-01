var ws = require('ws');
var wss = require('ws').Server;
var redis = require('redis').createClient(process.env.REDIS_URL);

var Boss = require('./../domain/boss.js').Boss;

var STATUS = Object.freeze({ALIVE: "ALIVE", DEAD: "DEAD"});
var allBoss = {};
var theBoss;

setInterval(function () {
        broadcastBossInformation()
    }, 100
);

exports.setWebSocketServer = function (webSocketServer)
{
    wss = webSocketServer;
}

exports.newConnection = function (webSocket)
{
    console.log("WebSocket connected from address: ", webSocket._socket.remoteAddress);

    webSocket.on("message", function (message)
    {
        newMessage(message, webSocket);
    });

    webSocket.on("close", function ()
    {
        close(webSocket);
    });
}

function newMessage(message, webSocket)
{
    var request = JSON.parse(message);

    if(request.function.name == "newBoss")
    {
        createNewBoss(request);
    }
    if(request.function.name == "attack")
    {
        if(theBoss == undefined)
        {
            theBoss = new Boss(request.function.bossName);
            theBoss.initialize();
        }
        theBoss.receiveDamage(request.function.number);
    }
}

function createNewBoss(request)
{
    redis.hmset(request.boss.bossName, request.boss);
    theBoss = new Boss(request.boss.bossName);
    theBoss.initialize(function(err, data)
    {
        if(!err)
        {
            allBoss[request.boss.bossName] = theBoss.toJson();
            console.log("Boss parse :", allBoss["Rambo"]);
        }
    });
}

function close(webSocket)
{
    console.log("webSocket at address ", webSocket._socket.remoteAddress, " is disconnected!"); //TODO: For debug purpose
    webSocket.close();
}

function broadcast(data)
{
    var message = JSON.stringify(data);
    if (wss.clients)
    {
        wss.clients.forEach(function each(client)
        {
            client.send(message);
        });
    }
};

function broadcastBossInformation()
{
    if(theBoss != undefined)
    {
        if (wss.clients)
        {
            wss.clients.forEach(function each(client)
            {
                client.send(theBoss.toString());
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