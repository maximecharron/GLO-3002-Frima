var bossLife;

var async = require('async');
var ws = require('ws');
var wss = require('ws').Server;
var redisPub = require('redis').createClient(process.env.REDIS_URL);
var redisSub = require('redis').createClient(process.env.REDIS_URL);
var redisValuesHandler = require('redis').createClient(process.env.REDIS_URL);

getLife();

redisSub.subscribe("boss");
redisSub.on("message", function(channel, message)
{
    //console.log("Boss supposed live: ", message);
    bossLife = message;
    broadcast(message);
});

exports.newConnection = function(webSocket)
{
    console.log("webSocket at address ", webSocket._socket.remoteAddress, " is connected!"); //TODO: For debug purpose
    webSocket.on("message", function(message)
    {
        newMessage(message, webSocket);
    });

    webSocket.on("close", function()
    {
        close(webSocket);
    });
}

exports.setWebSocketServer = function(webSocketServer)
{
    wss = webSocketServer;
}

function close(webSocket)
{
    console.log("webSocket at address ", webSocket._socket.remoteAddress, " is disconnected!"); //TODO: For debug purpose
    webSocket.close();
}

function newMessage(message, webSocket)
{
    redisPub.publish("boss", bossLife - 1);
    // console.log("webSocket at address ", webSocket._socket.remoteAddress, " send new message: ", message); //TODO: For debug purpose
    // if (webSocket.readyState == ws.OPEN)
    // {
    //     webSocket.send("U send me that? " + message + "   The boss life is: " + bossLife);
    // }
}

function broadcast(data)
{
  wss.clients.forEach(function each(client)
  {
    client.send(data);
  });
};

function getLife()
{
    async.waterfall([
        getCurrentBossLife(currentBossLifeCallBack),
        getConstantBossLife(constantBossLifeCallBack)
    ]);
}



function getCurrentBossLife (currentBossLifeCallBack)
{
    redisValuesHandler.get('currentBossLife',function(error, result)
    {
        if(error)
        {
            console.log("Error getting currentBossLife: ", error);
        }
        if(!result)
        {
            console.log("currentBossLife is null or empty.");
            currentBossLifeCallBack(null);
        }
        else
        {
            bossLife = result;
            console.log("currentBossLife: ", bossLife)
            currentBossLifeCallBack(null);
        }
    });
}

function getConstantBossLife(constantBossLifeCallBack)
{
    if(!bossLife)
    {
        redisValuesHandler.get('constantBossLife',function(error, result)
        {
            if(error)
            {
                console.log("Error getting constantBossLife: ", error);
            }
            if(!result)
            {
                console.log("constantBossLife is null or empty.");
                bossLife = 10000000; //TODO: A modifier car ne devrais pas harcoder de valeur. Devrais aller rechercher en BD Mongo les valeurs de la partie.
                constantBossLifeCallBack(null);
            }
            else
            {
                bossLife = result;
                console.log("constantBossLife: ", bossLife)
                constantBossLifeCallBack(null);
            }
        })
    }
    else
    {
        constantBossLifeCallBack(null);
    }
}
