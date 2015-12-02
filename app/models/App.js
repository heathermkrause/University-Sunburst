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

    /**
     * Sets choosen category
     */
    App.prototype.setCategory = function(category, indStartAngle, indEndAngle){
        this.set({
            indStartAngle : indStartAngle,
            indEndAngle : indEndAngle
        });

        this.set('category', category);
    };

    return App;
});