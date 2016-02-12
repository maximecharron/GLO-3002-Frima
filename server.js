var express = require('express');
var app = express();
var http = require('http');
var ws = require('ws');
var WebSocketServer = require("ws").Server
var port = process.env.PORT || 3000;
var server = http.createServer(app)

server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws){
    ws.on('message', function (mess) {
        onNewMessage(ws);
    });
    ws.on("close", function () {
        console.log("websocket connection close")
    });
});

function onNewMessage(socket) {
    var pi = 3.14;
    for (var i = 0; i<10000; i++){
        var j = i;
    }
    if (socket.readyState == ws.OPEN) {
        socket.send("Pi is " + pi);
    }
}
