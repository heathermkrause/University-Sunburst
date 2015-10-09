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
})