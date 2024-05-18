import {Emitter} from '../../lib/Emitter.js';
export class StateController extends Emitter {
    constructor(level) {
        super();
        this._level = level;
        this.actors = level.actors;
        this.status = 'playing';
    }

    get level() {return this._level;}
    get player() {
        return this.actors.find(a => a.type === 'player');
    }

    update(time, keyList) {
        this.actors = this.actors.map(a => {
           a.update(time, this.level, keyList); 
           return a;
        });
        const player = this.player;
        let coinDelete = null;
        const coins = this.actors.filter(a => a.type === 'coin');
        for (let coin of coins) {
            if (this.level.collision(player, coin)) {
                coinDelete = coin;
                break;
            }
        }
        
        const lavaList = this.actors.filter(a => a.type === 'lava');
        for (let lava of lavaList) {
            if (this.level.collision(player, lava)) {
                this.status = 'game-over';        
                break;
            }
        }

        if (this.status !== 'game-over' && this.level.toutch(player.pos, player.size, 'lava')) {
            this.status = 'game-over';
        }

        if (coinDelete && this.status !== 'game-over') {
            this.actors = this.actors.filter(a => a !== coinDelete);
        }
        if (coins.length === 0) {
            this.status = 'next';
        }
        
        this.emit('sync', this);
    }
}