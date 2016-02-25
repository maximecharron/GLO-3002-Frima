var express = require('express');
var app = express();
var http = require('http');
var WebSocketServer = require("ws").Server
var port = process.env.PORT || 3000;
var server = http.createServer(app)


var webSocketHandler = require('./webSocketHandler.js')

server.listen(port)

console.log("http server listening on %d", port)

var webSocketServer = new WebSocketServer({server: server})
webSocketHandler.setWebSocketServer(webSocketServer); // Set le webSocketServer dans le socketHandler

console.log("websocket server created")

webSocketServer.on("connection", webSocketHandler.newConnection)
