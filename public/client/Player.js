import { GameClient } from "./GameClient.js";

export class Player {
    constructor(x, y) {
        this.connected = false;
        this.id = null; // server determines this
        this.x = x;
        this.y = y;
        this.prediction = true; 
        this.reconciliation = true;
        this.inputSequenceNum = 0; // to track which packets were processed by server
        this.pendingInputs = []; // packets that have yet to be processed by server
    }

    init() {
        let sheetBaseTexture = PIXI.BaseTexture.from('/otsp_creatures_01.png');
        this.playerTexture = new PIXI.Texture(sheetBaseTexture, new PIXI.Rectangle(96, 0, 32, 32));
        this.lastMoveTime = new Date(); 
    }

    onConnected(msg) {
        this.connected = true;
        this.id = msg.playerId;
    }

    onMove(msg) { // this message is embedded in the broadcast payload, its not the ws layer message
        msg = msg.state[this.id];
        this.setPos(msg.x, msg.y);

        if (this.reconciliation) {
            for (let i = 0; i < this.pendingInputs.length; i++) {
                if (this.pendingInputs[i].sequenceNum <= msg.sequenceNum) {
                    this.pendingInputs.splice(i, 1);
                } else {
                    this.setPos(this.pendingInputs[i].x, this.pendingInputs[i].y);
                }
            }
        }
    }

    processInput(x, y) {
        const now = new Date();
        if (now - this.lastMoveTime > 100) { // in ms
            this.lastMoveTime = now;

            if (this.prediction) {
                this.setPos(x, y);
            }

            //if (this.connection.readyState === WebSocket.OPEN) {
            if (this.connected) {
                const gameClient = new GameClient(); // singleton 
                const connection = gameClient.getConnection();

                const walkToPacket = {msgType: 'move', playerId: this.id, sequenceNum: this.inputSequenceNum++, x: x, y: y};
                this.pendingInputs.push(walkToPacket); // to be processed by server

                connection.send(JSON.stringify(walkToPacket));
            }
        }
    }

    setPos(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    togglePrediction() {
        this.prediction = !this.prediction;
        console.log('prediction = ' + this.prediction.toString());
    }

    toggleReconciliation() {
        this.reconciliation = !this.reconciliation;
        console.log('reconciliation = ' + this.reconciliation.toString());
    }

    getId() {
        return this.id;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getTexture() {
        return this.playerTexture;
    }
}
