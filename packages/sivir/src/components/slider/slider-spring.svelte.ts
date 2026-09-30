export type SliderSpringConfig = {
    stiffness: number;
    damping: number;
};

const SUBSTEP = 1 / 240;
const MAX_FRAME = 1 / 30;
const REST_DISTANCE = 0.005;
const REST_VELOCITY = 0.05;

function prefersReducedMotion() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return true;
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export class SliderSpring {
    current = $state(0);

    #target = 0;
    #velocity = 0;
    #frame = 0;
    #last = 0;
    #config: SliderSpringConfig = {
        stiffness: 1,
        damping: 1
    };

    constructor(initial: number) {
        this.current = initial;
        this.#target = initial;
    }

    set(target: number, config: SliderSpringConfig) {
        this.#target = target;
        this.#config = config;

        if (prefersReducedMotion() || typeof requestAnimationFrame !== 'function') {
            this.jump(target);
            return;
        }

        this.#start();
    }

    kick(velocity: number, config: SliderSpringConfig) {
        if (prefersReducedMotion() || typeof requestAnimationFrame !== 'function') {
            return;
        }

        this.#config = config;
        this.#velocity += velocity;
        this.#start();
    }

    jump(value: number) {
        this.stop();
        this.#target = value;
        this.#velocity = 0;
        this.current = value;
    }

    stop() {
        if (this.#frame) {
            cancelAnimationFrame(this.#frame);
            this.#frame = 0;
        }
    }

    #start() {
        if (this.#frame) {
            return;
        }

        this.#last = performance.now();
        this.#frame = requestAnimationFrame(this.#tick);
    }

    #tick = (now: number) => {
        let remaining = Math.min((now - this.#last) / 1000, MAX_FRAME);
        let position = this.current;

        this.#last = now;

        while (remaining > 0) {
            const dt = Math.min(SUBSTEP, remaining);
            const force =
                this.#config.stiffness * (this.#target - position) -
                this.#config.damping * this.#velocity;

            this.#velocity += force * dt;
            position += this.#velocity * dt;
            remaining -= dt;
        }

        const settled =
            Math.abs(this.#target - position) < REST_DISTANCE &&
            Math.abs(this.#velocity) < REST_VELOCITY;

        if (settled) {
            this.#frame = 0;
            this.#velocity = 0;
            this.current = this.#target;
            return;
        }

        this.current = position;
        this.#frame = requestAnimationFrame(this.#tick);
    };
}
