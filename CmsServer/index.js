require('newrelic');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var boss = require('./routes/bosses.js');

var cors = require('cors');
var passport = require('passport');

var mongoose = require('mongoose');
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
app.post('/signup', authentication.isAuthenticatedAsSuperAdmin, passport.authenticate('local-signup'));

app.get('/bossesConstant', authentication.isAuthenticated,boss.getConstantBossList);
app.get('/bosses',authentication.isAuthenticated, boss.getBossList);
app.post('/update',authentication.isAuthenticated, boss.updateBoss);

var port = process.env.PORT || 3000;
app.listen(port);
