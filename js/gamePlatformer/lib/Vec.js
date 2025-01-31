export class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(other) {
        return new Vec(
            this.x + other.x,
            this.y + other.y);
    }

    times(multyple) {
        return new Vec(this.x * multyple, this.y * multyple);
    }
}