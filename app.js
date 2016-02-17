var express = require('express');
var app = express();
var cors = require('cors');

var corsOptions = {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'UPDATE'],
    credentials: true
}


app.use(express.static(__dirname+ '/app'));
app.use(cors(corsOptions));
var server = app.listen(process.env.PORT || 8080);

