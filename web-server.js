require('newrelic');
var express = require('express');
var http = require('http');
var path = require('path');
var morgan = require('morgan'); // formerly express.logger
var app = express();

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'components'));
app.engine('html', require('ejs').renderFile);

// express/connect middleware
app.use(morgan('dev'));

// serve up static assets
app.use(express.static(path.join(__dirname, 'app')));

http.createServer(app).listen(app.get('port'), function () {
    console.log('myApp server listening on port ' + app.get('port'));
});
