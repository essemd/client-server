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

        console.log('input.init()');
    }

    isPressed(key) {
        return this.pressed[key];
    }
}
