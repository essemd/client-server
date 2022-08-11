const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 1337 });

//import { GameServer } from "./public/server/GameServer.js";
const GameServer = require('./public/server/GameServer.js');
const gameServer = new GameServer();

wss.on('connection', function (ws) {
    gameServer.handleConnection(ws);
});

setInterval(gameServer.run.bind(gameServer), 100);
