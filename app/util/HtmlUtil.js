define(["exports", "./query"], function(exports, query){
    /**
     * Populates dropdown with provided collection of an elements
     * Each element of the collection should contain id and name properties
     * @param el    HTMLSelectElement
     * @param coll  Collection of {id : '', name : ''}
     */
    exports.populateDropdown = function(el, coll){
        var optsEl = query.one('.options', el);

        coll.forEach(function(item){
            var node = optsEl.appendChild(document.createElement('div'));

            node.className = 'item';
            node.setAttribute('data-id', item.id);
            node.innerHTML = item.name;
        });
    }

    /**
     * Adds css class to html element if it does not yet exists
     *
     * @param el
     * @param cssClass
     */
    exports.addClass = function addClass(el, cssClass) {
        var newClasses = cssClass.split(/\s+/);
        if(newClasses.length > 1){
            newClasses.forEach(function(c){
                addClass(el, c);
            });

            return;
        }

        if (el.className.indexOf(cssClass) == -1) {
            el.className = el.className + ' ' + cssClass;
        }
    }

    /**
     * Removes css class from html element
     *
     * @param el
     * @param cssClass
     */
    exports.removeClass = function removeClass(el, cssClass) {
        var newClasses = cssClass.split(/\s+/);
        if(newClasses.length > 1){
            newClasses.forEach(function(c){
                removeClass(el, c);
            });

            return;
        }
        var cls = " " + el.className + " ",

            cls = cls.replace(' ' + cssClass + ' ', ' ').trim();

        el.className = cls;
    }

    /**
     * Removes if element has provided css class
     *
     * @param el
     * @param cssClass
     */
    exports.containsClass = function(el, cssClass) {
        return el.className.indexOf(cssClass) != -1;
    }

})