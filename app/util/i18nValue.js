define([], function () {
    var DEFAULT_LANG = 'en';
    /**
     * Returns localized value of the property from context
     * @param context
     * @param prop
     * @param lang
     */
    return function(context, prop, lang){
        lang = lang || DEFAULT_LANG;

        var localized = context[lang];
        if(typeof localized == 'undefined' || !localized[prop]){
            localized = context[DEFAULT_LANG];
        }

        return localized[prop];
    }
});