define(['text!./templates/Dropdown.html', '../util/query'], function (template, query) {
    /**
     * Iterates over array like structure
     */
    function forEach(it, callback){
        if(it.forEach){
            it.call(it, it.forEach, callback);

        }else if(typeof it.length !== 'undefined'){
            for(var i = 0, l = it.length; i < l; i++){
                var d = it[i];
                callback.call(it, d, i);
            }
        }
    }

    /**
     * Adds css class to html element if it does not yet exists
     *
     * @param el
     * @param cssClass
     */
    function addClass(el, cssClass) {
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
    function removeClass(el, cssClass) {
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
    function containsClass(el, cssClass) {
        return el.className.indexOf(cssClass) != -1;
    }

    /**
     * Simple event emmiter
     */
    function emit(target, type, details) {
        if (target.dispatchEvent && document.createEvent) {
            var evt = document.createEvent('HTMLEvents');

            details = details || {};

            evt.initEvent(type, !!details.bubbles, !!details.cancelable);

            for (p in details) {
                evt[p] = details[p];
            }

            target.dispatchEvent(evt);
        }
    }

    // stores currently active drop down
    var activedd = null;

    /**
     * Handles click on the item
     *
     * @private
     */
    function clickItem(itemNode, el) {
        var value = itemNode.getAttribute('data-id');
        _setValue(el, value, itemNode.innerHTML);

        close();
    }

    /**
     * Opens provided dropdown
     *
     * @private
     */
    function open(el) {
        addClass(el, 'opened');
        activedd = el;
    }

    /**
     * Closes provided dropdown
     * @private
     */
    function close() {
        removeClass(activedd, 'opened');
        activedd = null;
    }

    /**
     * Ensures that there is such value in dd choice and sets this value
     *
     * @param el
     * @param value
     * @private
     */
    function setValue(el, value) {
        var item = query.one('.item[data-id="' + value + '"]', el);
        if (!item) {
            return;
        }

        _setValue(el, value, item.innerHTML);
    }

    /**
     * Sets dropdown value. Here value is supposed to exists in drop down.
     * Called only from setValue Dont call this method directly
     * @param el
     * @param value
     * @private
     */
    function _setValue(el, value, text) {
        if (el.value == value) {
            return;
        }

        el.value = value;
        query.one('.text', el).innerHTML = text;

        forEach(query('.item', el), function (el) { removeClass(el, 'selected')})

        addClass(query.one('.item[data-id="' + value + '"]', el), 'selected');

        emit(el, 'change', {value: value});
    }

    /**
     * Returns function that will call callback and pass 'el' as first argument before arguments
     * Eg wrapWithEl(el, setValue) will return function that awaits for 'value' parameter, but will call
     * setValue method with (el, value)
     */
    function wrapWithEl(el, callback) {
        return function () {
            var args = [el].concat(Array.prototype.slice.call(arguments, 0));
            callback.apply(null, args);
        }
    }

    /**
     * Attaches click on the window event. If we have opened drop down and click was done outside of dropdown - closes dd
     */
    window.addEventListener('click', function (evt) {
        if (!activedd) {
            return;
        }

        var n = evt.target,
            outside = true;

        while (n) {
            if (n === activedd) {
                outside = false;
                break;
            }

            n = n.parentNode;
        }

        outside && close();
    });

    /**
     * If user clicks ESC key and there was activedd = closes it
     */
    window.addEventListener('keyup', function (evt) {
        activedd && evt.keyCode == 27 && close();
    });


    /**
     * Creates drop down functionality
     */
    return function (el) {
        el.addEventListener('click', function (evt) {
            if (containsClass(evt.target, 'item')) {
                clickItem(evt.target, el)
            } else {
                open(el);
            }
        });

        return {
            setValue: wrapWithEl(el, setValue)
        }
    }
});
