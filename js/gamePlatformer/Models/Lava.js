import { Vec } from "../lib/Vec.js";
import {Actor} from './Actor.js';

export default class Lava extends Actor{
    constructor(type, pos, speed, size, ch, reset) {
        super(type, pos, speed, size);
        this._ch = ch;
        if (reset) {
            this._reset = reset;
        }
    }

    static create(pos, ch) {
        switch(ch) {
            case '|':
                return new Lava('lava',
                pos, new Vec(0, 2), Lava._size, ch);
            case 'v':
                return new Lava('lava',
                pos, new Vec(0, 4),Lava._size, ch, pos);
            case '=':
                return new Lava('lava',
                pos, new Vec(2, 0), Lava._size, ch);
        }
    }

    update(time, level) {
        const newPos = this._pos.plus(this._speed.times(time));
        if (!level.toutch(newPos, this.size, 'wall')) {
            this._pos = newPos;
        } else {
            switch(this._ch) {
                case 'v':
                    this._pos = this._reset;
                    break;
                default:
                    this._speed = this.speed.times(-1);
            }
        }
    }
}

Lava._size = new Vec(1, 1);