var express = require('express');
var app = express();
var http = require('http');
var ws = require('ws');
var WebSocketServer = require("ws").Server;
var port = process.env.PORT || 3000;
var server = http.createServer(app);
var status = require('./routes/status.js');
var login = require('./routes/login');
var passport = require('passport');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');



var mongoose = require('mongoose');
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://cms:cms@ds061395.mlab.com:61395/heroku_p5td8svk';
mongoose.connect(mongoUri);

var tokenSecret = 'FRIMA_TOKEN_SECRET' || process.env.TOKEN_SECRET;

var webSocketHandler = require('./handlers/webSocketHandler.js');


app.set('jwtTokenSecret', tokenSecret);

require('./middleware/passport')(passport, app);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'ubeat_session_secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.get('/status', status.getStatus);

app.post('/login', passport.authenticate('local-login'), login.getToken);
app.post('/signup', passport.authenticate('local-signup'), login.getToken);
app.get('/logout', login.logout);
//app.post('/facebook', passport.authenticate('facebook-login'), login.getToken);

server.listen(port);

console.log("http server listening on %d", port);

var webSocketServer = new WebSocketServer({server: server});
webSocketHandler.setWebSocketServer(webSocketServer); // Set le webSocketServer dans le socketHandler

console.log("websocket server created");
webSocketHandler.initializeBoss(function(){
    console.log("Initialized boss");
});
webSocketServer.on("connection", webSocketHandler.newConnection);
