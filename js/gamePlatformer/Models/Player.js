import { Vec } from "../lib/Vec.js";
import {Actor} from './Actor.js';

export default class Player extends Actor{
    constructor(type, pos, speed, size) {
        super(type, pos, speed, size);
    }

    static create(pos) {
        const size = Player._size;
        pos = pos.plus(new Vec(-(size.x - 1), -(size.y - 1)));
        return new Player('player', pos, new Vec(0, 0), size);
    }

    update(time, level, keyList) {
        const playerXSpeed = 7;
        const gravity = 30;
        const jumped = 17;
        const ySpeed = this._speed.y + gravity * time;

        let xSpeed = 0;
        if (keyList.KeyD) xSpeed = playerXSpeed;
        if (keyList.KeyA) xSpeed -= playerXSpeed;
        const movedX = this._pos.plus(new Vec(time * xSpeed, 0));
        if (!level.toutch(movedX, this.size, 'wall')) {
            this._pos = movedX;
        }

        const movedY = this._pos.plus(new Vec(0, ySpeed * time));
        if (!level.toutch(movedY, this.size, 'wall')) {
            this._speed = new Vec(0, ySpeed);
            this._pos = movedY;
        } else if (keyList.KeyW && ySpeed > 0) {
            this._speed.y = -jumped;
        } else {
            this._speed = new Vec(0, 0);
        }

    }
}

Player._size = new Vec(0.8, 1.5);