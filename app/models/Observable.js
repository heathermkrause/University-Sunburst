define([], function(){
    /**
     * Very basic implementation of the object whose properties can be observer
     * For correctly property observing it must be changed with set(name, value) method
     *
     * @constructor
     */
    var Observable = function(){
    }

    /**
     * Sets value of the given property and notify available listeners
     * @param name
     * @param value
     */
    Observable.prototype.set = function(name, value){
        if(typeof name === "object"){
            for(p in name){
                this.set(p, name[p]);
            }

            return;
        }

        var oldValue = this[name];
        this[name] = value;
        this._notify && this._notify(name, value, oldValue);
    }

    /**
     * Starts observing property of the object by name. When property is changed callback will be called
     *
     * @param name      Name of the property to observe
     * @param callback  Callback function
     */
    Observable.prototype.observe = function(name, callback){
        var cbn = '_' + name,
            notify = this._notify;

        if(!notify){
            notify = this._notify = function(name, value, oldValue){
                var callbacks = this._notify['_' + name];
                if(callbacks){
                    for(var i = 0, l = callbacks.length; i < l; i++){
                        callbacks[i].call(this, name, value, oldValue);
                    }
                }
            }
        }

        var callbacks = this._notify[cbn];

        if(!callbacks){
            callbacks = this._notify[cbn] = [];
        }

        callbacks.push(callback);
    }

    return Observable;
});