var messages = [];
var ws = require('ws');

exports.onConnection = function (socket) {
    socket.on('message', function (mess) {
        onNewMessage(socket);
    });
    socket.on("close", function () {
        console.log("websocket connection close")
    });
}

function onNewMessage(socket) {
    var pi = estimatePi();
    if (socket.readyState == ws.OPEN) {
        socket.send("Pi is " + pi);
    }
}

function estimatePi() {
    var n = 10000000, inside = 0, i, x, y;

    for (i = 0; i < n; i++) {
        x = Math.random();
        y = Math.random();
        if (Math.sqrt(x * x + y * y) <= 1)
            inside++;
    }

    return 4 * inside / n;
}
