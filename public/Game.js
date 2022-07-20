import { Player } from "./Player.js";

export class Game {
    static run() {
        console.log('running once...');
        let player = new Player(0, 0);  
        player.initConnection();
        function sendWalk() {player.sendWalkTo(player.x + 1, player.y);}
        setTimeout(sendWalk, 100); // WebSocket connection established asynchronously
    }
}
