const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 1337 });

wss.on('connection', function (ws) {
  ws.on('message', function (msg) {
    console.log('received: %s', msg);
  });

  ws.send('i am server');
});
