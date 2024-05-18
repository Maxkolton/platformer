import { Vec } from "../lib/Vec.js";
import {Actor} from './Actor.js';

export default class Coin  extends Actor{
    constructor(type, pos, speed, size) {
        super(type, pos, speed, size);
        this._radius = 0.1;
        this._startPos = this._pos;
        this._angle = Math.random() * 360;
    }

    static create(pos) {
        return new Coin('coin', pos, new Vec(0, 360), Coin._size);
    }

    update(time) {
        const angle = (this._angle + this.speed.times(time).y) % 360;
        const radian = angle * Math.PI / 180;
        const step = Math.sin(radian) * this._radius;
        const newPos = this._startPos.plus(new Vec(0, step));
        this._angle = angle;
        this._pos = newPos;
    }
}

Coin._size = new Vec(0.5, 0.5);