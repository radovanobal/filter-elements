export default class BaseObserver {
    constructor() {
        if (new.target === BaseObserver) {
            throw new TypeError("Cannot construct BaseObserver instances directly");
        }

        if (typeof this.update !== "function") {
            throw new TypeError("Must override update method");
        }
    }
}
