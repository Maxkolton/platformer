export class Emitter {
    constructor() {
        this._eventList = new Map();
    }

    on(event, callback) {
        const ConstructName = Object.getPrototypeOf(this).constructor.name;
        if (typeof event !== 'string') {
            throw new TypeError(`первый аргумент метода 
            ${ConstructName}.prototype.on(event: string, handler: function)
            должен быть строкой`);
        }
        if (typeof callback !== 'function') {
            throw new TypeError(`второй аргумент метода 
            ${ConstructName}.prototype.on(event: string, handler: function)
            должен быть function`);
        }
        if (!this._eventList.has(event)) {
            this._eventList.set(event, [callback]);
            return this;
        }

        const handlers = this._eventList.get(event);
        handlers.push(callback);
        this._eventList.set(event, handlers);
        return this;
    }

    once(event, callback) {
        const name = callback.name;
        const handlers = this._eventList.get(event);
        if (!handlers) {
            return this.on(event, callback);
        }
        const isHas = handlers.some(handl => handl.name === name);
        if (isHas) {
            return this;
        }
        return this.on(event, callback);
    }

    emit(event, data = {}) {
        const handlers = this._eventList.get(event);
        if (handlers) {
            handlers.forEach(handl => {
                handl(data);
            });
        }
    }
}