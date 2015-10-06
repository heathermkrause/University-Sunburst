define(["exports"], function(exports){
    /**
     * Populates dropdown with provided collection of an elements
     * Each element of the collection should contain id and name properties
     * @param el    HTMLSelectElement
     * @param coll  Collection of {id : '', name : ''}
     */
    exports.populateDropdown = function(el, coll){
        // TODO treat collection as collection of simple strings
        for(var i = 0, l = coll.length; i < l; i++){
            var opt = document.createElement('option');
            opt.value = coll[i].id;
            opt.text = coll[i].name;

            el.appendChild(opt);
        }
    }
})