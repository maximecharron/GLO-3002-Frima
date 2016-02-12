require('newrelic');
var express = require('express');
var app = express();
var http = require('http');
var ws = require('ws');
var WebSocketServer = require("ws").Server

//io.on('connection', chat.onConnection);
//
//http.listen(process.env.PORT || 3000);
//console.log('App started at port 3000!!!');
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

function estimatePi() {
    var n = 10000000, inside = 0, i, x, y;

    for (i = 0; i < n; i++) {
        x = Math.random();
        y = Math.random();
        if (Math.sqrt(x * x + y * y) <= 1)
            inside++;
    }

    return 4 * inside / n;
}