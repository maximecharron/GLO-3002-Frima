var bossLife = 10000000000;

var ws = require('ws');
var redisPub = require('redis').createClient(process.env.REDIS_URL);
var redisSub = require('redis').createClient(process.env.REDIS_URL);

redisSub.subscribe("boss");
redisSub.on("message", function(channel, message)
{
    console.log("Boss supposed live: ", message);
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
