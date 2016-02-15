var express = require('express');
var app = express();
var http = require('http');
var ws = require('ws');
var WebSocketServer = require("ws").Server
var port = process.env.PORT || 3000;
var server = http.createServer(app)


var webSocketHandler = require('./webSocketHandler.js')

server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
webSocketHandler.setWebSocketServer(wss);
console.log("websocket server created")

wss.on("connection", webSocketHandler.newConnection)
