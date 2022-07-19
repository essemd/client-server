var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
}; 

function preload ()
{
}

function create ()
{
}

function send() {
    connection.send('i am client, i send stuff over websocket');
}

let game = new Phaser.Game(config);
let connection = new WebSocket('ws://localhost:1337');

connection.onopen = function () {
    console.log('***WebSocket connected on client side');
    send();
}

connection.onmessage = function(msg) {
    console.log('sent from wss:', msg);
}

