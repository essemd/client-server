const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 1337 });

wss.on('connection', function (ws) {
  ws.on('message', function (msg) {
    console.log('received from player:', JSON.parse(msg));
    ws.send(JSON.stringify(JSON.parse(msg)));
    console.log('sent:', JSON.stringify(JSON.parse(msg)));
  });
});
