define([], function () {

    /**
     * Creates new tooltip object in context of provided dom node
     *
     * @param context   DOM node where tooltip will be created. If not provided - uses document.body
     *
     * @constructor
     */
    function Tooltip(context) {
        var node = this.node = (context||document.body).appendChild(document.createElement('div'));

        node.id = TOOLTIP_ID = 'datassist_tooltip_' + (new Date().valueOf());
        node.className = 'datassist-tooltip';

        var pos = context.style.position;
        if(pos != 'absolute' && pos != 'fixed'){
            context.style.position = 'relative';
        }
    }

    /**
     * Shows tooltip text at given coordinates
     */
    Tooltip.prototype.show = function (text, top, left) {
        var node = this.node,
            st = node.style;

        node.innerHTML = text;

        st.top = top;
        st.left = left;
    }

    Tooltip.prototype.hide = function(){
        this.node.style.top = '-10000px';
    }


    return Tooltip;
});