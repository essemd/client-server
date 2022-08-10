export class Input {
    constructor() {
        this.pressed = {};
    }

    init() {
        window.addEventListener('keydown', (e) => {
            this.pressed[e.keyCode] = true;

        });

        window.addEventListener('keyup', (e) => {
            this.pressed[e.keyCode] = false;
        });
    }

    isPressed(key) {
        return this.pressed[key];
    }
}
