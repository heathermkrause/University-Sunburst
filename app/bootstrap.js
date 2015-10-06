define(['views/Component'], function(component){
    if(typeof window['datassist'] == 'undefined'){
        window.datassist = {};
    }

    var datassist = window.datassist;

    /**
     * Registers function that initiates compoenent in datassist namespace
     *
     * @param el
     */
    datassist.init = function(el){
        component(el);
    }

    return datassist.init;
})