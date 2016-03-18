var request = require('supertest');
var should = require('chai').should();
var app = require('../../server.js');
var agent = request.agent(app);

var WebSocket = require('ws');


// get users
describe('GET /api/users', function() {
    it('returns users as JSON', function(done) {
        var ws = new WebSocket('ws:localhost:3000');

        ws.on("message", function(message){
            console.log(message);
            done();
        })
    });
});