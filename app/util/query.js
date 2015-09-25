define([], function(){
    /**
     * This is not polyfills, just shortening of methods
     */

    /**
     * Shortening for target.querySelectorAll()
     *
     * @param q
     * @param context
     * @returns {NodeList}
     */
    function query(q, context){
        return (context ? context : document).querySelectorAll(q)
    };

    /**
     * Shortening notation for target.querySelector()
     *
     * @param q
     * @param context
     * @returns {Element}
     */
    query.one = function(q, context){
        return (context ? context : document).querySelector(q, context);
    }

    return query;
});