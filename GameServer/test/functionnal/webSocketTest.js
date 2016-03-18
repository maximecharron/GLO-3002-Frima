require('../../server.js');

var WebSocket = require('ws');

before(function(done){
    setTimeout(function(){done();}, 500);
})

describe('GET /api/users', function() {
    it('returns users as JSON', function(done) {
        var ws = new WebSocket('ws:localhost:3000');

        ws.on("message", function(message){
            console.log(message);
            done();
        })
    });
});