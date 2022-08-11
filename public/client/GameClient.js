import { Player } from "./Player.js";
import { Input } from "./Input.js";
import { Map } from "./Map.js";

const W = 87;
const A = 65;
const S = 83;
const D = 68;
const P = 80;
const R = 82;

let gameClient = null;

export class GameClient {
    constructor() {
        if (!gameClient) {
            this.players = [];
            this.lastTs = new Date();

            gameClient = this;
        }

        return gameClient;
    }

    init() {
        this.pixiApp = new PIXI.Application({ width: 1024, height: 1024 });
        document.body.appendChild(this.pixiApp.view);

        Map.init();
        this.tiles = Map.getTiles();
        this.mapping = Map.getMapping();

        this.input = new Input();
        this.input.init();

        this.player = new Player(0, 0);  
        this.player.init();

        this.connection = new WebSocket('ws://localhost:1337');

        this.connection.onopen = () => {
            console.log('connection to game server established!');
        }

        this.connection.onmessage = (msg) => {
            const msgData = JSON.parse(msg.data);

            switch (msgData.msgType) {
                case 'connected':
                    this.player.onConnected(msgData);
                    break;
                case 'broadcast':
                    this.player.onMove(msgData);
                    // iterate through state payload
                        // if its another player
                            // update that player locally
                        // if its us
                            // Player.onMove(msg);
                    break;
            }
        };
    }
    
    getConnection() {
        return this.connection;
    }

    processInput() {
        const nowTs = new Date();
        const dtSec = (nowTs - this.lastTs) / 1000;

        if (this.input.isPressed(W)) 
            this.player.processInput(this.player.x, this.player.y - 1);

        else if (this.input.isPressed(A))
            this.player.processInput(this.player.x - 1, this.player.y);

        else if (this.input.isPressed(S)) {
            this.player.processInput(this.player.x, this.player.y + 1);
        }

        else if (this.input.isPressed(D))
            this.player.processInput(this.player.x + 1, this.player.y);

        else if (this.input.isPressed(P)) {
            if (dtSec > 0.1) {
                this.player.togglePrediction();
                this.lastTs = nowTs;
            }
        }

        else if (this.input.isPressed(R)) {
            if (dtSec > 0.1) {
                this.player.toggleReconciliation();
                this.lastTs = nowTs;
            }
        }
    }

    update() {
        this.processInput();
    }

    render() {
        // remove sprites from previous frame
        for (let i = this.pixiApp.stage.children.length - 1; i >= 0; i--) {
            this.pixiApp.stage.removeChild(this.pixiApp.stage.children[i]);
        }

        for (let y = 0; y < Map.getHeight(); y++) {
            for (let x = 0; x < Map.getWidth(); x++) {

                const tileIndex = y * Map.getWidth() + x;
                const tileId = this.tiles[tileIndex];
                const tileTexture = this.mapping[tileId]; 

                let tileSprite = new PIXI.Sprite(tileTexture);
                tileSprite.position.set(x * 32, y * 32);

                this.pixiApp.stage.addChild(tileSprite);
            }
        }
    
        // render player
        let playerSprite = new PIXI.Sprite(this.player.getTexture());
        playerSprite.position.set(this.player.getX() * 32, this.player.getY() * 32);

        this.pixiApp.stage.addChild(playerSprite);
    }

    run() {
        // update
        this.update();
        // render
        this.render();
    }
}
