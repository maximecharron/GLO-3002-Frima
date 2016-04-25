require('newrelic');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var boss = require('./routes/bosses.js');
var combo = require('./routes/combos.js');
var item = require('./routes/item.js');
var gameConfig = require('./routes/gameConfig.js');

var cors = require('cors');
var passport = require('passport');

var mongoose = require('mongoose');
var login = require('./routes/login');
var status = require('./routes/status');
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/frimaGameServer';
mongoose.connect(mongoUri);

var authentication = require('./middleware/authentication');
var app = express();
var corsOptions = {
    origin: ['http://localhost:8080', 'http://localhost:4000', 'http://frima-cms-client.herokuapp.com'],
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'UPDATE'],
    credentials: true
};
require('./middleware/passport')(passport, app);
var tokenSecret = 'CMS_TOKEN_SECRET' || process.env.TOKEN_SECRET;

app.set('jwtTokenSecret', tokenSecret);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'frima_session_secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cors(corsOptions));

app.post('/login', passport.authenticate('local-login'), login.getToken);
app.get('/logout', login.logout);

app.post('/signup', authentication.isAuthenticatedAsSuperAdmin, passport.authenticate('local-signup'), login.getToken);
app.get('/status', status.getStatus);

app.get('/bossesConstant', authentication.isAuthenticated,boss.getConstantBossList);
app.get('/bosses',authentication.isAuthenticated, boss.getBossList);
app.post('/update',authentication.isAuthenticated, boss.updateBoss);
app.get('/combos', authentication.isAuthenticated, combo.getCombos);
app.post('/combos', authentication.isAuthenticated, combo.updateCombo);
app.put('/combos', authentication.isAuthenticated, combo.newCombo);
app.delete('/combos/:id', authentication.isAuthenticated, combo.deleteCombo);
app.get('/gameConfig', authentication.isAuthenticated, gameConfig.getGameConfig);
app.post('/gameConfig', authentication.isAuthenticated, gameConfig.updateGameConfig);
app.get('/items', authentication.isAuthenticated, item.getItems);
app.post('/items', authentication.isAuthenticated, item.updateItem);
app.put('/items/', authentication.isAuthenticated, item.createItem);
app.delete('/items/:id', authentication.isAuthenticated, item.deleteItem);

var port = process.env.PORT || 3000;
console.log("Server listening on port "+port);
app.listen(port);
