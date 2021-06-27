import BaseObserver from "./BaseObserver";

export default class Subject {
    constructor() {
        /**
         *
         * @type {BaseObserver[]}
         */
        this.observers = [];
    }

    /**
     * Attach a observer that will be notified when the conditions are met
     * @param {BaseObserver} observer
     * @throws Error
     */
    attach(observer){
        if(observer instanceof BaseObserver){
            this.observers.push(observer);
        } else {
            throw new Error('attached object must be instance of BaseObserver!');
        }
    }

    /**
     * Detach a observer that is no longer needed
     * @param observer
     */
    detach(observer){
        this.observers = this.observers.filter(
            function(item) {
                if (item !== observer) {
                    return item; // return all but the subject beign removed
                }
            }
        );
    }

    /**
     * notifies all BaseObserver objects of the change
     * @param objectInstance
     * @param message
     */
    notify(objectInstance, message){
        for(let i = 0; i < this.observers.length; i++){
            if(this.observers[i] instanceof objectInstance)
                this.observers[i].update(message);
        }
    }
}
