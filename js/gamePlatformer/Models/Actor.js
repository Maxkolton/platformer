export class Actor {
    constructor(type, pos, speed, size) {
        this._type = type;
        this._pos = pos;
        this._speed = speed;
        this._size = size;

        this._requiredProperty({
            property: '_size',
            isStatic: true
        });
        this._requiredMethod({
            method: 'create',
            isStatic: true
        });
        this._requiredMethod({
            method: 'update'
        });
    }

    get type() {return this._type;}
    get pos() {return this._pos;}
    get speed() {return this._speed;}
    get size() {return this._size;}

    _requiredMethod({method, isStatic = false}) {
        const Construct = Object.getPrototypeOf(this).constructor;
        if (isStatic && !Construct[method]) {
            throw new Error(`У прототипа ${Construct.name} не реалезован
            обязательный статический метод ${Construct.name}.${method}()`);
        }
        if (!isStatic && !this[method]) {
            throw new Error(`У экземпляра класса ${Construct.name} не реалезован
            обязательный метод ${Construct.name}.prototype.${method}()`);
        }
    }

    _requiredProperty({property, isStatic = false}) {
        const Construct = Object.getPrototypeOf(this).constructor;
        if (isStatic && !Construct[property]) {
            throw new Error(`У прототипа ${Construct.name} не реалезовано
            обязательное статическое свойство ${Construct.name}.${property}`);
        }
        if (!isStatic && !this[property]) {
            throw new Error(`У экземпляра класса ${Construct.name} не реалезовано
            обязательное свойство ${Construct.name}.prototype.${property}`);
        }
    }
}