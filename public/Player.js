export class Player {
    constructor(x, y) {
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

        this.connection = new WebSocket('ws://localhost:1337');

        this.connection.onopen = () => {
            console.log('connection to game server established!');
        }

        this.connection.onmessage = (msg) => {
            const walkToPacket = JSON.parse(msg.data); // server validated walk request
            this.setPos(walkToPacket.x, walkToPacket.y);

            if (this.reconciliation) {
                for (let i = 0; i < this.pendingInputs.length; i++) {
                    if (this.pendingInputs[i].sequenceNum <= walkToPacket.sequenceNum) {
                        this.pendingInputs.splice(i, 1);
                    } else {
                        this.setPos(this.pendingInputs[i].x, this.pendingInputs[i].y);
                    }
                }
            }
        };
    }

    processInput(x, y) {
        if (this.prediction) 
            this.setPos(x, y); // client prediction

        if (this.connection.readyState === WebSocket.OPEN) {
            const walkToPacket = {sequenceNum: this.inputSequenceNum++, x: x, y: y};
            this.pendingInputs.push(walkToPacket); // to be processed by server
            this.connection.send(JSON.stringify(walkToPacket));
            //console.log('sent: %d %d', x, y); 
        }
    }

    setPos(newX, newY) {
        this.x = newX;
        this.y = newY;
        //console.log('walked to:', newX, newY);
    }

    togglePrediction() {
        this.prediction = !this.prediction;
        console.log('prediction = ' + this.prediction.toString());
    }

    toggleReconciliation() {
        this.reconciliation = !this.reconciliation;
        console.log('reconciliation = ' + this.reconciliation.toString());
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
