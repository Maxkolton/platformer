import * as conf from '../../config/graphics.js';
export class ViewRender {
    constructor(state) {
        this._state = state;
        this._game = _elt('div', {
            class: 'game',
            style: `
                width: ${conf.gameWidth}px;
                height: ${conf.gameHeight}px;
            `
        });
        this._frame = this._drawsGrid();
        this._actors = this._drawsActors(state);

        this._frame.append(...this._actors);
        this._game.append(this._frame);
        this._state.on('sync', this._changeRender.bind(this));
    }

    get game() {
        return this._game;
    }

    _drawsGrid() {
        const level = this._state.level;
        const width = level.width;
        const height = level.height;
        return _elt('div', {
            class: 'frame',
            style: `
                position: relative;
                width: ${width * conf.unit}px;
                height: ${height * conf.unit}px;
            `
        }, ...level.level.map(row => _elt('div', {
            class: 'row'
        }, ...row.map(cell => _elt('div', {
            class: cell,
            style: `
                    width: ${conf.unit}px;
                    height: ${conf.unit}px;
                    `
        })))));
    }

    _drawsActors(state) {
        const actors = state.actors;
        return actors.map(a => _elt('div', {
            class: a.type,
            style: `
                    position: absolute;
                    width: ${conf.unit * a.size.x}px;
                    height: ${conf.unit * a.size.y}px;
                    top: ${conf.unit * a.pos.y}px;
                    left: ${conf.unit * a.pos.x}px;
                `
        }));
    }

    _changeRender(newState) {
        this._actors.forEach(a => a.remove());
        this._actors = this._drawsActors(newState);
        this._frame.append(...this._actors);
        const status = newState.status;
        if (status !== 'playing') this._game.classList.add(status); 
        this._scrollViewPort(newState.player);
    }

    _scrollViewPort(player) {
        const width = this._game.clientWidth;
        const height = this._game.clientHeight;
        const left = this._game.scrollLeft;
        const right = left + width;
        const top = this._game.scrollTop;
        const bottom = top + height;
        const margin = width / 3;

        const center = player.pos.plus(player.size.times(0.5))
                                .times(conf.unit);
        if (center.x < left + margin) {
            this._game.scrollLeft = center.x - margin;
        } else if (center.x > right - margin) {
            this._game.scrollLeft = center.x + margin - width;
        }

        if (center.y < top + margin) {
            this._game.scrollTop = center.y - margin;
        } else if (center.y > bottom - margin) {
            this._game.scrollTop = center.y + margin - height;
        }

    }

}

function _elt(name, attrs, ...childs) {
    const node = document.createElement(name);
    for (let prop in attrs) {
        node.setAttribute(prop, attrs[prop]);
    }
    node.append(...childs);
    return node;
}