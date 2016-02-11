require('newrelic');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');

var cors = require('cors');
var passport = require('passport');

var mongoose = require('mongoose');
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/frima-cms';
mongoose.connect(mongoUri);

var authentication = require('./middleware/authentication');
var app = express();
var corsOptions = {
    origin: ['http://localhost:8080', 'http://frima-cms.herokuapp.com', 'http://localhost:4000'],
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'UPDATE'],
    credentials: true
};

require('./middleware/passport')(passport, app);

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
app.use(cors(corsOptions));

//app.post('/login', passport.authenticate('local-login'));
//app.get('/logout', login.logout);


app.post('/update', function(req, res){
    console.log(req.body);
    res.status(200).send(req.body);
})

var port = process.env.PORT || 3000;
app.listen(port);
