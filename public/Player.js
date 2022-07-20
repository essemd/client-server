export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    initConnection() {
        this.connection = new WebSocket('ws://localhost:1337');
        this.connection.onopen = () => {
            console.log('connection to game server established!');
        }
        this.connection.onmessage = (msg) => {
            const walkToCoord = JSON.parse(msg.data);
            console.log('received:', walkToCoord);
            this.walkTo(walkToCoord.x, walkToCoord.y);
        };
    }

    sendWalkTo(x, y) {
        if (this.connection.readyState === WebSocket.OPEN) {
            this.connection.send(JSON.stringify({x: x, y: y}));
            console.log('sent: %d %d', x, y); 
        }
    }

    walkTo(newX, newY) {
        this.x = newX;
        this.y = newY;
        console.log('walked to:', newX, newY);
    }

    render() {
        // render the player at (x, y) in the game world     
    }
}
