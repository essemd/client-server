import { Player } from "./Player.js";
import { Input } from "./Input.js";

const W = 87;
const A = 65;
const S = 83;
const D = 68;

export class Game {
    constructor() {}

    init() {
        this.input = new Input();
        this.input.init();

        this.player = new Player(0, 0);  
        this.player.init();
    }

    update() {
        if (this.input.isPressed(W)) 
            this.player.sendWalkTo(this.player.x, this.player.y - 1);

        else if (this.input.isPressed(A))
            this.player.sendWalkTo(this.player.x - 1, this.player.y);

        else if (this.input.isPressed(S))
            this.player.sendWalkTo(this.player.x, this.player.y + 1);

        else if (this.input.isPressed(D))
            this.player.sendWalkTo(this.player.x + 1, this.player.y);
    }

    render() {
        this.player.render();
    }

    run() {
        // update
        this.update();
        // render
        this.render();
    }
}
