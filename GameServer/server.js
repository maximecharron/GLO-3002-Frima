require('newrelic');
var express = require('express');
var app = express();
var http = require('http');
var ws = require('ws');
var cors = require('cors');
var WebSocketServer = require("ws").Server;
var port = process.env.PORT || 4000;
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
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/frimaGameServer';
mongoose.connect(mongoUri);
var tokenSecret = process.env.TOKEN_SECRET || 'FRIMA_TOKEN_SECRET';
var allowOrigin = ["https://frima-client-1.herokuapp.com", "http://frima-client-1.herokuapp.com", "localhost:8080"];
var corsOptions = {
    origin: allowOrigin,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'UPDATE'],
    credentials: true
};

app.set('jwtTokenSecret', tokenSecret);

require('./middleware/passport')(passport, app);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'frima_session_secret',
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

server.listen(port);

console.log("http server listening on %d", port);

//Initialize main components

require("./constants/bossConstants.js");
var webSocketServer = new WebSocketServer({server: server});

var ItemRepository = require('./repository/itemRepository.js');
var itemRepository = new ItemRepository();

var LootService = require('./services/lootService.js');
var lootService = new LootService(itemRepository);

var UserRepository = require('./repository/userRepository.js');
var userRepository = new UserRepository();

var UserService = require('./services/userService.js');
var userService = new UserService(userRepository);

var UserCommunicationService = require('./services/userCommunicationService.js');
var userCommunicationService = new UserCommunicationService();

var BossCommunicationService = require('./services/bossCommunicationService.js');
var bossCommunicationService = new BossCommunicationService(webSocketServer, lootService, userService);

var RedisCommunicationService = require('./services/redisCommunicationService.js');
var redisCommunicationService = new RedisCommunicationService();

var BossRepository = require('./repository/bossRepository.js');
var bossRepository = new BossRepository(redisCommunicationService);

var BossService = require('./services/bossService.js');
var bossService = new BossService(bossCommunicationService, bossRepository, redisCommunicationService);

var UpdateService = require('./services/updateService.js');
var updateService = new UpdateService(bossRepository, bossCommunicationService, bossService, redisCommunicationService);

var GameRepository = require('./repository/gameRepository.js');
var gameRepository = new GameRepository();

var GameService = require('./services/gameService.js');
var gameService = new GameService(gameRepository, lootService, userService);

var GameCommunicationService = require('./services/gameCommunicationService.js');
var gameCommunicationService = new GameCommunicationService(webSocketServer, gameService);

var RedisListenerService = require('./services/redisListenerService.js');
var redisListenerService = new RedisListenerService(bossService, bossCommunicationService, lootService, gameService, gameCommunicationService, userService);

var WebSocketAPI = require('./api/webSocketAPI.js');
var webSocketAPI = new WebSocketAPI(bossService, bossCommunicationService, redisCommunicationService, webSocketServer, userService, userCommunicationService, gameCommunicationService);

console.log("websocket server created");
webSocketAPI.initializeBoss();
webSocketServer.on("connection", webSocketAPI.newConnection);

module.exports = app;