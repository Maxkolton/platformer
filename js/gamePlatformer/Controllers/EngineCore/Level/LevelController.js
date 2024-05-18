import {Vec} from '../../../lib/Vec.js';
export class LevelController {
    constructor(level, actors) {
        this.level = level;
        this.actors = actors;
        this.width = level[0].length;
        this.height = level.length;
    }

    static _mapActors = {
        '.': 'empty',
        '#': 'wall',
        '+': 'lava',
        '|': '_Lava',
        'v': '_Lava',
        '=': '_Lava',
        '@': '_Player',
        'o': '_Coin',
    };

    static async asyncInstace(levelString) {
        const level = [];
        const actors = [];
        const positionList = [];

        levelString.trim().split('\n')
            .map((row, y)=>{
                level[y] = [];
                [...row].map((ch, x) => {
                    const type = this._mapActors[ch];
                    if (!/^_[a-z]+/i.test(type)) {
                        return level[y].push(type);
                    }
                    const ActorName = type.replace(/^_/i, '');
                    level[y].push('empty');
                    positionList.push({
                        pos: new Vec(x, y),
                        ch});
                    return actors.push(import(`../../../Models/${ActorName}.js`));
                });
            });
        return new this(
            level,
            await this._asyncLoadActors(actors, positionList));
    }

    static async _asyncLoadActors(actorList, positionList) {
        const Actors = await Promise.all(actorList);
        return Actors.map((A, index) => {
            const {pos, ch} = positionList[index];
            return A.default.create(pos, ch);
        });
    }

    toutch(pos, size, type) {
        const xStart = Math.floor(pos.x);
        const xEnd = Math.ceil(pos.x + size.x);
        const yStart = Math.floor(pos.y);
        const yEnd = Math.ceil(pos.y + size.y);
        
        for (let y = yStart; y < yEnd; y++) {
            for (let x = xStart; x < xEnd; x++) {
                const isBorder = x < 0 || x === this.width ||
                                 y < 0 || y === this.height;
                const char = isBorder ? 'wall': this.level[y][x];
                if (char === type) return true;
            }
        }
        return false;
    }

    collision(a1, a2) {
        return a1.pos.x + a1.size.x > a2.pos.x &&
               a1.pos.x < a2.pos.x + a2.size.x &&
               a1.pos.y + a1.size.y > a2.pos.y &&
               a1.pos.y < a2.pos.y + a2.size.y;
    }
}