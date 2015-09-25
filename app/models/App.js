define(['./Observable'], function(Observable){
    /**
     * Main application model. Will hold information about current state
     *
     * @param data
     * @constructor
     */
    var App = function(data){
        data && this.set(data);
    }

    App.prototype = Object.create(Observable.prototype);
    App.prototype.constructor = App;

    return App;
});