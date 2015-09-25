define(["exports"], function(exports){
    var MEASURE_SPAN_ID = '__datassist_measure_span_' + (new Date().getTime());
    /**
     * Populates dropdown with provided collection of an elements
     * Each element of the collection should contain id and name properties
     * @param el    HTMLSelectElement
     * @param coll  Collection of {id : '', name : ''}
     */
    exports.populateDropdown = function(el, coll, opt){
        // TODO treat collection as collection of simple strings
        for(var i = 0, l = coll.length; i < l; i++){
            var opt = document.createElement('option');
            opt.value = coll[i].id;
            opt.text = coll[i].name;

            el.appendChild(opt);
        }
    }


    /**
     * Measures width of the text with given css class
     * TODO: provide option to create measure element in context of some element, not in body.
     * @param text
     * @param css
     * @param parent    Optional parent element where measure span is appended
     * @returns {number}
     */
    exports.measure = function(text, css, parent){
        var span = document.getElementById(MEASURE_SPAN_ID);
        if(!span){
            span = document.createElement('span');
            span.style.visibility = 'hidden';
            span.style.position = 'absolute';
            span.id = MEASURE_SPAN_ID;

            (parent||document.body).appendChild(span);
        }

        span.className = css||'';
        span.innerHTML = text;

        return span.offsetWidth;
    }
})