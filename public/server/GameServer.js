class GameServer {   
    constructor() {
        this.players = {}; // pid: {ws, pid, x, y}
        this.messageQueue = []; // message1, message2, ... messageN
        this.lastProcessedInput = {}; // pid: sequenceNum
        this.latestPlayerIndex = 0;
    }

    handleConnection(ws) {
        const connectionMessage = {msgType: 'connected', playerId: this.latestPlayerIndex, x: 0, y: 0};
        ws.send(JSON.stringify(connectionMessage));

        this.players[this.latestPlayerIndex++] = {ws, pid: this.latestPlayerIndex, x: 0, y: 0};

        ws.on('message', (msg) => {
            msg = JSON.parse(msg);
            if (msg.msgType === 'move') {// sanity check
                this.messageQueue.push(msg);
            }
        });
    }
    
    updateState() {
        for (let i = 0; i < this.messageQueue.length; i++) {
            const msg = this.messageQueue[i];
            const player = this.players[msg.playerId];
            
            //player.x, player.y = msg.x, msg.y; // figure out why this lead to buggy behaviour
            player.x = msg.x;
            player.y = msg.y;

            this.lastProcessedInput[msg.playerId] = msg.sequenceNum;

            //this.messageQueue.splice(i, 1);
        }
        console.log(this.messageQueue);
        this.messageQueue = [];
    }

    broadcastState() {
        let worldState = [];

        // format the world state so that it is useable by clients
        //for (let [pid, player] of this.players) {
        for (const pid in this.players) {
            // the sequenceNum is used by the client only when playerId matches the clients players id (for reconciliation)
            worldState.push({ playerId: pid, sequenceNum: this.lastProcessedInput[pid], x: this.players[pid].x, y: this.players[pid].y });
        }

        // broadcast it
        //for (let [pid, player] of this.players) {
        for (const pid in this.players) {
            this.players[pid].ws.send(JSON.stringify({ msgType: 'broadcast', state: worldState }));
        }
    }

    run() {
        // process queued messages for each connected player, updating game state
        this.updateState();
        // broadcast current game state 
        this.broadcastState();
    }

}

module.exports = GameServer;
