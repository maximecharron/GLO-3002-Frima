var express = require('express');
var app = express();
var http = require('http');
var ws = require('ws');
var WebSocketServer = require("ws").Server
var port = process.env.PORT || 3000;
var server = http.createServer(app)
var status = require('./routes/status.js');
var login = require('./routes/login');
var passport = require('passport');
var mongoose = require('mongoose');



//var mongoose = require('mongoose');
//var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/ubeat';
//mongoose.connect(mongoUri);

var tokenSecret = 'FRIMA_TOKEN_SECRET' || process.env.TOKEN_SECRET;

var webSocketHandler = require('./handlers/webSocketHandler.js')


app.set('jwtTokenSecret', tokenSecret);

require('./middleware/passport')(passport, app);
app.get('/status', status.getStatus);

app.post('/login', passport.authenticate('local-login'), login.getToken);
app.get('/logout', login.logout);
//app.post('/facebook', passport.authenticate('facebook-login'), login.getToken);

server.listen(port)

console.log("http server listening on %d", port)

var webSocketServer = new WebSocketServer({server: server})
webSocketHandler.setWebSocketServer(webSocketServer); // Set le webSocketServer dans le socketHandler

console.log("websocket server created")

webSocketServer.on("connection", webSocketHandler.newConnection);
