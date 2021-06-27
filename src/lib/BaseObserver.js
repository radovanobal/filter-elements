class BaseObserver {
    constructor() {
        Object.setPrototypeOf(this, BaseObserver.prototype);

        if (new.target === BaseObserver) {
            throw new TypeError("Cannot construct BaseObserver instances directly");
        }

        if (typeof this.update !== "function") {
            throw new TypeError("Must override update method");
        }
    }
}

export let baseObserver = new BaseObserver();
