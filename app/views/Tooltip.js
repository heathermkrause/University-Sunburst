define([], function () {

    /**
     * Creates new tooltip object in context of provided dom node
     *
     * @param context   DOM node where tooltip will be created. If not provided - uses document.body
     *
     * @constructor
     */
    function Tooltip(context) {
        context = context || document.body;
        var node = this.node = context.appendChild(document.createElement('div'));

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

        if(this._hideTimer){
            clearTimeout(this._hideTimer);
        }

        node.innerHTML = text;

        st.top = top;
        st.left = left;
    }

    Tooltip.prototype.offsetWidth = function(){
        return this.node.offsetWidth;
    }

    Tooltip.prototype.hide = function(){
        var _this = this;
        this._hideTimer = setTimeout(function(){
            _this.node.style.top = '-10000px';
            _this._hideTimer = null;
        }, 200);
    }


    return Tooltip;
});