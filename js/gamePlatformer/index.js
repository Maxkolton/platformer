import { LevelController } from './Controllers/EngineCore/Level/LevelController.js';
import { asyncLoadLevel } from './lib/asyncLoadLevel.js';
import { StateController } from './Controllers/EngineCore/StateController.js';
import { ViewRender } from './Controllers/ViewRender/ViewRender.js';
import { Emitter } from './lib/Emitter.js';
import { counterFPS } from './lib/counterFPS.js';


class App extends Emitter {
    constructor() {
        super();
        this._gameFrame = null;
        this._keyList = Object.create(null);
    }

    getGameFrame(wrap = document.body) {
        return new Promise((resolve)=>{
            this.on('loaded', game => {
                this._handlerKeys();
                wrap.append(game);
                resolve(game);
            });
            this._init(1);
        });
    }

    #keys = ['KeyW', 'KeyD', 'KeyA'];

    #handl = (e) => {
        if (this.#keys.includes(e.code)) {
            this._keyList[e.code] = e.type === 'keydown';
            e.preventDefault();
        }
    }

    _handlerKeys() {
        document.body.removeEventListener('keydown', this.#handl);
        document.body.removeEventListener('keyup', this.#handl);
        
        document.body.addEventListener('keydown', this.#handl);
        document.body.addEventListener('keyup', this.#handl);
    }

    async _init(levelNum) {
        let level = null;
        let state = null;
        let viewRender = null;
        let status = '';
        for await (let {default: levelStr} of asyncLoadLevel(levelNum)) {
            if (levelStr === null) {
                break;
            }
            
            level = await LevelController.asyncInstace(levelStr);
            state = new StateController(level);
            viewRender = new ViewRender(state);
            if (this._gameFrame === null) {
                this._gameFrame = viewRender.game;
                this.emit('loaded', this._gameFrame);
            }
            status = await this._runGame(state);
            if (status === 'game-over') {
                this._gameFrame.remove();
                this._gameFrame = null;
                return this._init(levelNum);
            }
            this._gameFrame.remove();
            this._gameFrame = null;
            levelNum++;
        }

        return alert('Победа!!!');
    }

    _runGame(state) {
        let lastTime = null;
        let delay = 800;
        let minTime = 0;
        const blockFPS = document.querySelector('.fps');
        const keyList = this._keyList;
        return new Promise((resolve)=>{
            requestAnimationFrame(animate);
            state.once('sync', newState => {
                const status = newState.status;
                if (status === 'playing') {
                    requestAnimationFrame(animate);
                } else if (status !== 'playing' && delay > 0) {
                    delay -= minTime;
                    requestAnimationFrame(animate);
                } else {
                    resolve(status);
                }
            });
        });

        function animate(curTime) {
            if (lastTime === null) lastTime = curTime;
            minTime = Math.min(curTime - lastTime, 100);
            lastTime = curTime;
            state.update(minTime / 1000, keyList);
            const fps = counterFPS();
            if (fps) {
                blockFPS.innerHTML = fps;
            }
        }
    }

}

export async function asyncGetGameFrame() {
    return await new App().getGameFrame();
}

